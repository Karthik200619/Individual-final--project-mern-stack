import { UserModel } from '../models/UserModel.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticate = async ({ UserObj }) => {
  if (!UserObj || typeof UserObj.password !== 'string') {
    const error = new Error('Valid registration details are required');
    error.status = 400;
    throw error;
  }

  const userData = { ...UserObj, email: String(UserObj.email || '').trim().toLowerCase() };
  userData.password = await hash(userData.password, 12);
  userData.role = 'USER';

  const user = await new UserModel(userData).save();
  const safeUser = user.toObject();
  delete safeUser.password;
  return { user: safeUser };
};

export const authenticatelogin = async ({ loginObj }) => {
  const email = String(loginObj?.email || '').trim().toLowerCase();
  const password = loginObj?.password;

  if (!email || typeof password !== 'string' || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await UserModel.findOne({ email });
  if (!user || !(await compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      profileImageUrl: user.profileImageUrl,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  const safeUser = user.toObject();
  delete safeUser.password;
  return { user: safeUser, token };
};
