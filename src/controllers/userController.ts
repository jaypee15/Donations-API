import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import Wallet from '../models/walletModel';
import jwt from 'jsonwebtoken';
import { ErrorObject } from '../utils/error';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = new User({ email, password, name });
  await user.save();
  
  const wallet = new Wallet({ userId: user._id });
  await wallet.save();

  res.status(201).json({ message: 'User created successfully' });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ErrorObject("Invalid credentials", 401);
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  res.json({ token, userId: user._id });
});

export const createTransactionPin = asyncHandler(async (req: Request, res: Response) => {
  const { userId, pin } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorObject('User not found', 404);
  }
  user.transactionPin = pin;
  await user.save();
  res.json({ message: 'Transaction PIN created successfully' });
});
