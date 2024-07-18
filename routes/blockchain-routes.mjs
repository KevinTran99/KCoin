import express from 'express';
import {
  mineBlock,
  getBlockchain,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/mine').get(mineBlock);

export default router;
