import mongoose from 'mongoose';
import bcrypto from 'bcryptjs';

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
  role: { type: String, enum: ['user', 'managar'], default: 'user' },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 5,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenTokenExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypto.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);
