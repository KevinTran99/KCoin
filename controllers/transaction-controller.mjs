import { transactionPool, wallet } from '../startup.mjs';

export const addTransaction = (req, res, next) => {
  const { amount, recipient } = req.body;

  let transaction;

  try {
    transaction = wallet.createTransaction({ recipient, amount });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: error.message });
  }

  res.status(201).json({ success: true, statusCode: 201, data: transaction });
};

export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: transactionPool.transactionMap,
  });
};
