import React, { useEffect, useState } from 'react';
import api from '../api';

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
      <div>
        {blockchain.length > 0 ? (
          blockchain.map((block, index) => (
            <div key={index}>
              <h3>Block {index}</h3>
              <p>{JSON.stringify(block)}</p>
            </div>
          ))
        ) : (
          <p>No blocks found</p>
        )}
      </div>
    </div>
  );
};
