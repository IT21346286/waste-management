import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const UserSchema = new Schema(
  {
    avatar: { type: String, default: '' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    quizHistory: [{ score: Number, timestamp: Date }], // Added quizHistory field
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

UserSchema.methods.generateJWT = function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model('User', UserSchema);
export default User;
