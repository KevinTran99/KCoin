import { blockchain, pubnubServer } from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, statusCode: 200, data: blockchain });
};

const mineBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const { nonce, timestamp, difficulty } = blockchain.proofOfWork(
    lastBlock.currentBlockHash,
    data
  );

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data,
    nonce,
    difficulty
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data,
    nonce,
    difficulty
  );

  pubnubServer.broadcast();

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Block created and distributed', block },
  });
};

export { mineBlock, getBlockchain };
