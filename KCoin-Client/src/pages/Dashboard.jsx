import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [blockchain, setBlockchain] = useState([]);
  const [error, setError] = useState(null);
  const [refreshMessage, setRefreshMessage] = useState('');

  useEffect(() => {
    fetchBlockchain();
  }, []);

  const fetchBlockchain = async () => {
    try {
      const response = await api.get('/api/v1/blockchain');
      const newChain = response.data.data.chain;

      if (JSON.stringify(newChain) === JSON.stringify(blockchain)) {
        setRefreshMessage('No new blocks');
      } else {
        setBlockchain(newChain);
        setRefreshMessage('Blockchain updated');
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch blockchain');
    } finally {
      setTimeout(() => {
        setRefreshMessage('');
      }, 2000);
    }
  };

  return (
    <div>
      <h1>Blockchain Dashboard</h1>
      <button onClick={fetchBlockchain}>Refresh Blockchain</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {refreshMessage && <p>{refreshMessage}</p>}

      {blockchain.length > 0 &&
        blockchain.map((block, blockIndex) => (
          <div className="block" key={blockIndex}>
            <h3>Block {blockIndex + 1}</h3>
            <ul>
              <li>Timestamp: {block.timestamp}</li>
              <li>BlockHash: {block.currentBlockHash}</li>
              <li>LastBlockHash: {block.lastBlockHash}</li>
            </ul>

            {block.data.length > 0 &&
              block.data.map((tx, txIndex) => (
                <div key={txIndex}>
                  <h4>Transaction {txIndex + 1}:</h4>

                  <div>
                    <ul>From: {tx.inputMap.address}</ul>

                    {Object.keys(tx.outputMap).map((recipient, index) => {
                      if (index === 1) return null;

                      return (
                        <ul key={index}>
                          <li>To: {recipient}</li>
                          <li>Value: {tx.outputMap[recipient]}</li>
                        </ul>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};
