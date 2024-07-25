import User from '../models/UserModel.mjs';

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  res.status(201).json({ success: true, statusCode: 201, message: user });
};

export const login = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: 'login works' });
};

export const getMe = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: 'getMe works' });
};

export const forgotPassword = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, data: 'forgotPassword works' });
};

export const resetPassword = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, data: 'resetPassword works' });
};

const createAndSendToken = (id, statusCode, res) => {};
