import Wallet from '../models/Wallet.mjs';
import {
  blockchain,
  pubnubServer,
  transactionPool,
  wallet,
} from '../startup.mjs';

export const addTransaction = (req, res, next) => {
  const recipient = req.body.recipient;
  let amount = req.body.amount;

  amount = parseInt(amount, 10);

  let transaction = transactionPool.transactionExist({
    address: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.updateOutputMap({ sender: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: error.message });
  }

  transactionPool.addTransaction(transaction);
  pubnubServer.broadcastTransactionPool();

  res.status(201).json({ success: true, statusCode: 201, data: transaction });
};

export const getWalletBalance = (req, res, next) => {
  const address = wallet.publicKey;
  const balance = Wallet.calculateBalance({ chain: blockchain, address });

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { address, balance } });
};

export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: transactionPool.transactionMap,
  });
};
