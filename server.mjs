import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import memberRouter from './routes/member-routes.mjs';

const app = express();
const PORT = process.argv[2] || process.env.PORT || 5010;

app.use(express.json());

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/members', memberRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
