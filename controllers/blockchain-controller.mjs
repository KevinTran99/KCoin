import Transaction from '../models/Transaction.mjs';
import {
  blockchain,
  pubnubServer,
  transactionPool,
  wallet,
} from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, statusCode: 200, data: blockchain });
};

const mineBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();

  const validTransactions = transactionPool.validateTransactions();
  validTransactions.push(Transaction.transactionReward({ miner: wallet }));

  const data = validTransactions;

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

  transactionPool.clearBlockTransactions({ chain: blockchain.chain });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Block created and distributed', block },
  });
};

export { mineBlock, getBlockchain };
