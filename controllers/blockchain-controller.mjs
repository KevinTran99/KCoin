import { blockchain } from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

const mineBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = blockchain.pendingTransactions;
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

  blockchain.memberNodes.forEach(async (url) => {
    const body = { block };
    await fetch(`${url}/api/v1/blockchain/block/broadcast`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  const reward = {
    amount: 3.125,
    sender: '0000',
    recipient: blockchain.nodeUrl,
  };

  await fetch(
    `${blockchain.nodeUrl}/api/v1/transactions/transaction/broadcast`,
    {
      method: 'POST',
      body: JSON.stringify(reward),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Block created and distributed', block },
  });
};

const broadcastBlock = (req, res, next) => {
  const block = req.body.block;
  const lastBlock = blockchain.getLastBlock();
  const hash = lastBlock.currentBlockHash === block.lastBlockHash;
  const index = lastBlock.blockIndex + 1 === block.blockIndex;

  if (hash && index) {
    blockchain.chain.push(block);
    blockchain.pendingTransactions = [];

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: { message: 'Block added and broadcasted', block: block },
    });
  } else {
    res.status(500).json({
      success: false,
      statusCode: 500,
      data: { message: 'Block rejected', block },
    });
  }
};

const synchronizeChain = async (req, res, next) => {
  try {
    const currentLength = blockchain.chain.length;
    let maxLength = currentLength;
    let longestChain = null;
    let longestPendingTransactions = [];

    const fetchPromises = blockchain.memberNodes.map(async (member) => {
      const response = await fetch(`${member}/api/v1/blockchain`);

      if (response.ok) {
        const result = await response.json();

        if (result.data.chain.length > maxLength) {
          maxLength = result.data.chain.length;
          longestChain = result.data.chain;
          longestPendingTransactions = result.data.pendingTransactions;
        }
      } else {
        console.error(`Failed to fetch blockchain from ${member}`);
      }
    });

    await Promise.all(fetchPromises);

    if (longestChain && blockchain.validateChain(longestChain)) {
      blockchain.chain = longestChain;
      blockchain.pendingTransactions = longestPendingTransactions;
    } else {
      console.log('Blockchain is already synced');
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { message: 'Synchronization is complete' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: { message: 'Failed to synchronize blockchain' },
    });
  }
};

export { mineBlock, getBlockchain, synchronizeChain, broadcastBlock };
