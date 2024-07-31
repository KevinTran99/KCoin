import React, { useState, useEffect } from 'react';
import api from '../api';

export const Transactions = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [refreshMessage, setRefreshMessage] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      const response = await api.get('/api/v1/wallet/transactions');
      const transactions = Object.values(response.data.data);

      if (
        JSON.stringify(transactions) === JSON.stringify(pendingTransactions)
      ) {
        setRefreshMessage('No new transactions');
      } else {
        setRefreshMessage('Transactions updated');
      }

      setPendingTransactions(transactions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed fetching transactions');
    } finally {
      setTimeout(() => {
        setRefreshMessage('');
        setError(null);
      }, 2000);
    }
  };

  const handleAddTransaction = async (event) => {
    event.preventDefault();
    try {
      await api.post('/api/v1/wallet/addtransaction', {
        amount,
        recipient,
      });
      setAmount('');
      setRecipient('');

      fetchPendingTransactions();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Adding transaction failed');
    } finally {
      setTimeout(() => {
        setRefreshMessage('');
        setError(null);
      }, 2000);
    }
  };

  return (
    <div>
      <h2>Send Transactions</h2>

      <form onSubmit={handleAddTransaction}>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Recipient:
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Add Transaction</button>
      </form>

      <button onClick={fetchPendingTransactions}>Refresh Transactions</button>
      {refreshMessage && <p>{refreshMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Pending Transactions</h3>

      <div>
        {pendingTransactions.length > 0 ? (
          pendingTransactions.map((tx, index) => (
            <div key={index}>
              <h5>ID: {tx.id}</h5>

              <ul>
                <li>Timestamp: {JSON.stringify(tx.inputMap.timestamp)}</li>
                <li>From: {Object.keys(tx.outputMap)[1]}</li>

                <li>
                  {Object.keys(tx.outputMap).map((key, idx) => {
                    if (idx === 1) return null;

                    return (
                      <ul key={idx}>
                        <li>To: {key}</li>
                        <li>Value: {tx.outputMap[key]}</li>
                      </ul>
                    );
                  })}
                </li>
              </ul>
            </div>
          ))
        ) : (
          <li>No pending transactions</li>
        )}
      </div>
    </div>
  );
};
