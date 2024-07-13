import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];

    this.memberNodes = [];

    this.pendingTransactions = [];

    this.nodeUrl = process.argv[3];

    this.createBlock(Date.now(), '0', '0', [], 2048, +process.env.DIFFICULTY);
  }

  createBlock(
    timestamp,
    lastBlockHash,
    currentBlockHash,
    data,
    nonce,
    difficulty
  ) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      lastBlockHash,
      currentBlockHash,
      data,
      nonce,
      difficulty
    );

    this.pendingTransactions = [];
    this.chain.push(block);

    return block;
  }

  createTransaction(amount, sender, recipient) {
    const transaction = new Transaction(amount, sender, recipient);

    return transaction;
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);

    return this.getLastBlock().blockIndex + 1;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, lastBlockHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      lastBlockHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);

    return hash;
  }

  proofOfWork(lastBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let timestamp, hash, difficulty;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.difficultyAdjustment(lastBlock, timestamp);
      hash = this.hashBlock(timestamp, lastBlockHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, timestamp, difficulty };
  }

  difficultyAdjustment(lastBlock, timestamp) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty } = lastBlock;

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty - 1
      : +difficulty + 1;
  }

  synchronizeChains(chain) {
    if (chain.length > this.chain.length && this.validateChain(chain)) {
      this.chain = chain;
    } else {
      return;
    }
  }

  validateChain(blockchain) {
    let isValid = true;

    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];

      const lastBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        block.timestamp,
        lastBlock.currentBlockHash,
        block.data,
        block.nonce,
        block.difficulty
      );

      if (hash !== block.currentBlockHash) isValid = false;

      if (block.lastBlockHash !== lastBlock.currentBlockHash) isValid = false;

      return isValid;
    }
  }
}
