import React, { useState } from 'react';
import api from '../api';

export const Mine = () => {
  const [miningStatus, setMiningStatus] = useState('');
  const [error, setError] = useState(null);

  const handleMine = async () => {
    try {
      setMiningStatus('Mining in progress...');

      await api.get('/api/v1/blockchain/mine');

      setMiningStatus('Mining successful! Block created.');

      setError(null);
    } catch (err) {
      setMiningStatus('Mining failed.');
      setError(err.response?.data?.error || 'An error occurred while mining.');
    } finally {
      setTimeout(() => {
        setMiningStatus('');
        setError(null);
      }, 3000);
    }
  };

  return (
    <div>
      <h2>Mine Transactions</h2>
      <button onClick={handleMine}>Mine Transactions</button>
      {miningStatus && <p>{miningStatus}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
