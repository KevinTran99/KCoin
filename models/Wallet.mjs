import { ellipticHash, createHash } from '../utilities/crypto-lib.mjs';

export default class Wallet {
  constructor() {
    this.balance = process.env.INITIAL_BALANCE;
    this.keyPair = ellipticHash.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(createHash(data));
  }
}
