import express from 'express';
import {
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
} from '../controllers/auth-controller.mjs';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').put(resetPassword);

export default router;
