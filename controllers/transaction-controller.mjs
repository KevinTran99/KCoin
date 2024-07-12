import { blockchain } from '../startup.mjs';

export const createTransaction = (req, res, next) => {
  const transaction = req.body;

  const blockId = blockchain.addTransaction(transaction);

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: { message: 'Transaction created', transaction, blockId },
  });
};

export const broadcastTransaction = (req, res, next) => {
  const data = req.body;

  const transaction = blockchain.createTransaction(
    data.amount,
    data.sender,
    data.recipient
  );

  const blockId = blockchain.addTransaction(transaction);

  blockchain.memberNodes.forEach(async (url) => {
    const body = transaction;
    await fetch(`${url}/api/v1/transactions/transaction/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: {
      message: 'Transaction created and distributed',
      transaction,
      blockId,
    },
  });
};
