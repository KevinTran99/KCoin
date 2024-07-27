import { asyncHandler } from '../middleware/asyncHandler.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import User from '../models/UserModel.mjs';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  createAndSendToken(user, 201, res);
});

export const login = asyncHandler(async (req, res, next) => {
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
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, statusCode: 200, data: user });
});

export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, statusCode: 200, data: user });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Input valid passwords', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.validatePassword(currentPassword))) {
    return next(new ErrorResponse('Password invalid', 401));
  }

  user.password = newPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});

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
