import express from 'express';
import { blockchain, pubnubServer, transactionPool } from './startup.mjs';
import { connectDb } from './config/mongodb.mjs';
import morgan from 'morgan';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import authRouter from './routes/auth-routes.mjs';

connectDb();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

const DEFAULT_PORT = +process.env.PORT;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
  pubnubServer.broadcast();
}, 1000);

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/wallet', transactionRouter);
app.use('/api/v1/auth', authRouter);

const synchronize = async () => {
  let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
  if (response.ok) {
    const result = await response.json();
    console.log('SYNC', result.data.chain);
    blockchain.synchronizeChains(result.data.chain);
  }

  response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
  if (response.ok) {
    const result = await response.json();
    console.log('SYNC', result.data);
    transactionPool.synchronizeTransactions(result.data);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = NODE_PORT || DEFAULT_PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR: ${err.message}`);

  server.close(() => process.exit(1));
});
