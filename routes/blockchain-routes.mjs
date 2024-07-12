import express from 'express';
import {
  broadcastBlock,
  mineBlock,
  getBlockchain,
  synchronizeChain,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/mine').get(mineBlock);
router.route('/consensus').get(synchronizeChain);
router.route('/block/broadcast').post(broadcastBlock);

export default router;
