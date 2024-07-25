import ErrorResponse from '../models/ErrorResponseModel.mjs';
import User from '../models/UserModel.mjs';

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  createAndSendToken(user, 201, res);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Email or password is missing', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Incorrect login', 401));
  }

  const isCorrect = await user.validatePassword(password);

  if (!isCorrect) {
    return next(new ErrorResponse('Incorrect login', 401));
  }

  createAndSendToken(user, 200, res);
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

const createAndSendToken = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({ success: true, statusCode, token });
};
