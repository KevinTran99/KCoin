import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';

export default class Transaction {
  constructor({ sender, recipient, amount }) {
    this.id = uuidv4().replaceAll('-', '');
    this.outputMap = this.createOutputMap({ sender, recipient, amount });
    this.inputMap = this.createInputMap({ sender, outputMap: this.outputMap });
  }

  createOutputMap({ sender, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;

    return outputMap;
  }

  createInputMap({ sender, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }

  updateOutputMap({ sender, recipient, amount }) {
    this.outputMap[recipient] = amount;

    this.outputMap[sender.publicKey] =
      this.outputMap[sender.publicKey] - amount;

    this.inputMap = this.createInputMap({ sender, outputMap: this.outputMap });
  }

  static validate(transaction) {
    const {
      inputMap: { adress, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, amount) => total + amount
    );

    if (amount !== outputTotal) return false;

    if (!verifySignature({ publicKey: adress, data: outputMap, signature }))
      return false;

    return true;
  }
}
