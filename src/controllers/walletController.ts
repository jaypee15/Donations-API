import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Wallet from '../models/walletModel';
import { ErrorObject } from '../utils/error';

export const getWallet = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new ErrorObject('Wallet not found', 404);
  }
  res.json(wallet);
});
