import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';

const app = express();
const PORT = process.argv[2] || process.env.PORT || 5010;

app.use(express.json());
app.use('/api/v1/blockchain', blockchainRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
