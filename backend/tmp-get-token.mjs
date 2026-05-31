import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
import UserModel from './models/UserModel.js';

async function main() {
  const conn = await mongoose.connect(process.env.DB_URL);
  const user = await UserModel.findOne();
  if (!user) {
    console.error('No user found');
    process.exit(1);
  }
  console.log('userId', user._id.toString());
  console.log('token', jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET));
  await conn.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
