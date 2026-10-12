import express from 'express';
import { hash } from 'bcryptjs';
import { authenticatelogin } from '../Service/authService.js';
import { VerifyToken } from '../middlewares/VerifyToken.js';
import { UserModel } from '../models/UserModel.js';
import generateOTP from '../Service/createPassCrypto.js';
import sendemail from '../config/nodemailer.js';
import { OtpModel } from '../models/OtpModel.js';

export const CommonApi = express.Router();

CommonApi.post('/login', async (req, res) => {
  const { user, token } = await authenticatelogin({ loginObj: req.body });
  res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).json({ message: 'Login successful', payload: user });
});

CommonApi.get('/logout', (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).json({ message: 'Logout successful' });
});

CommonApi.get('/refresh', VerifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id).select('-password');
  if (!user) return res.status(401).json({ message: 'Session user no longer exists' });
  return res.status(200).json({ message: 'Refresh successful', payload: user });
});

CommonApi.post('/forgetpass', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await UserModel.findOne({ email });
  return res.status(200).json({
    message: user ? 'User exists with this email' : 'User not found',
    payload: { email: user ? email : null, isPresent: Boolean(user) },
  });
});

CommonApi.post('/sendotp', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOTP();
  await OtpModel.deleteMany({ email, purpose: 'RESET_PASSWORD' });
  await OtpModel.create({
    email,
    otp,
    purpose: 'RESET_PASSWORD',
    verified: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const message = '<h2>Password reset OTP</h2><p>Your code expires in 5 minutes.</p>';
  await sendemail(email, 'Password Reset OTP', message.replace('</p>', `</p><p>Code: <strong>${otp}</strong></p>`));
  return res.status(200).json({ message: 'OTP sent successfully' });
});

CommonApi.post('/verify-register-otp', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();
  const otpData = await OtpModel.findOne({ email, otp, purpose: 'REGISTER', expiresAt: { $gt: new Date() } });

  if (!otpData) return res.status(400).json({ message: 'Invalid or expired OTP' });

  await UserModel.updateOne({ email }, { isEmailVerified: true });
  await OtpModel.deleteMany({ email, purpose: 'REGISTER' });
  return res.status(200).json({ message: 'Email verified successfully' });
});

CommonApi.post('/verifyotp', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();
  const otpData = await OtpModel.findOne({
    email,
    otp,
    purpose: 'RESET_PASSWORD',
    expiresAt: { $gt: new Date() },
  });

  if (!otpData) return res.status(400).json({ message: 'Invalid or expired OTP' });

  otpData.verified = true;
  await otpData.save();
  return res.status(200).json({ message: 'OTP verified' });
});

CommonApi.post('/resetpassword', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;

  if (!email || typeof password !== 'string' || password.length < 8 || password.length > 128 ||
      !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) ||
      !/[@$!%*?&]/.test(password)) {
    return res.status(400).json({
      message: 'Password must be 8–128 characters and include uppercase, lowercase, number, and special character',
    });
  }

  const verifiedOtp = await OtpModel.findOne({
    email,
    purpose: 'RESET_PASSWORD',
    verified: true,
    expiresAt: { $gt: new Date() },
  });
  if (!verifiedOtp) return res.status(401).json({ message: 'A valid password-reset OTP is required' });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = await hash(password, 12);
  await user.save();
  await OtpModel.deleteMany({ email, purpose: 'RESET_PASSWORD' });
  return res.status(200).json({ message: 'Password reset successful' });
});
