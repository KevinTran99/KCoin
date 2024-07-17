import { transactionPool, wallet } from '../startup.mjs';

export const addTransaction = (req, res, next) => {
  res.status(201).json({ success: true, statusCode: 201, data: {} });
};

export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: transactionPool.transactionMap,
  });
};
