import express from 'express';
import {
  addTransaction,
  getTransactionPool,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transactions').get(getTransactionPool);
router.route('/addtransaction').post(addTransaction);

export default router;
