import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import Wallet from '../models/walletModel';
import jwt from 'jsonwebtoken';
import { ErrorObject } from '../utils/error';

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(new ErrorObject("A user with this email already exists", 400));
  }
  
  const user = new User({ email, password, name });
  await user.save(); // If this fails, it will be caught by the centralized error handler

  const wallet = new Wallet({ userId: user._id });
  await wallet.save();

  // Exclude password and ID from the response
  const { password: _, _id, ...userResponse } = user.toObject(); // Destructure to exclude password and ID

  res.status(201).json({ message: 'User created successfully', user: userResponse });
});

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorObject("Invalid credentials", 401));
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  res.json({ "access_token": token });
});

export const createTransactionPin = asyncHandler(async (req: Request, res: Response, next) => {
  const { userId, pin } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorObject('User not found', 404));
  }
  user.transactionPin = pin;
  await user.save();
  res.json({ message: 'Transaction PIN created successfully' });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}, 'email name'); // Fetch all users, only returning email and name
  res.json(users);
});
