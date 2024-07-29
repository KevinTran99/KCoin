import mongoose from 'mongoose';
import bcrypto from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name required'] },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Input a correct email',
    ],
  },
  role: { type: String, enum: ['user', 'manager'], default: 'user' },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 5,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypto.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function (passwordToCheck) {
  return await bcrypto.compare(passwordToCheck, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  return this.resetPasswordToken;
};

export default mongoose.model('User', userSchema);
