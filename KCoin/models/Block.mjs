export default class Block {
  constructor(
    timestamp,
    blockIndex,
    lastBlockHash,
    currentBlockHash,
    data,
    nonce,
    difficulty
  ) {
    this.timestamp = timestamp;
    this.blockIndex = blockIndex;
    this.lastBlockHash = lastBlockHash;
    this.currentBlockHash = currentBlockHash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || +process.env.DIFFICULTY;
  }
}
