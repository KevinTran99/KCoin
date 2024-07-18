import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];

    this.createBlock(1, '0', '0', [], 2048, +process.env.DIFFICULTY);
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

    this.chain.push(block);

    return block;
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

    if (timestamp - lastBlock.timestamp > MINE_RATE) {
      return difficulty > 1 ? +difficulty - 1 : +difficulty;
    } else {
      return +difficulty + 1;
    }
  }

  synchronizeChains(chain, onSuccess) {
    if (chain.length > this.chain.length && this.validateChain(chain)) {
      if (onSuccess) onSuccess();

      this.chain = chain;
    } else {
      return;
    }
  }

  validateChain(blockchain) {
    if (JSON.stringify(blockchain[0]) !== JSON.stringify(this.chain[0])) {
      return false;
    }

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

      if (hash !== block.currentBlockHash) return false;

      if (block.lastBlockHash !== lastBlock.currentBlockHash) return false;

      if (Math.abs(lastBlock.difficulty - block.difficulty) > 1) return false;
    }

    return true;
  }
}
