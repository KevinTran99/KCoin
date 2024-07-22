import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  getWalletBalance,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transactions').get(getTransactionPool);
router.route('/addtransaction').post(addTransaction);
router.route('/balance').get(getWalletBalance);

export default router;
