import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Donation from '../models/donationModel';
import User from '../models/userModel';
import Wallet from '../models/walletModel';
import { sendThankYouMessage } from '../services/communicationService';
import { ErrorObject } from '../utils/error';

export const createDonation = asyncHandler(async (req: Request, res: Response) => {
  const { donorId, beneficiaryId, amount } = req.body;
  
  const donorWallet = await Wallet.findOne({ userId: donorId });
  if (!donorWallet || donorWallet.balance < amount) {
    throw new ErrorObject("Insufficient balance", 400);
  }

  const donation = new Donation({ donorId, beneficiaryId, amount });
  await donation.save();

  donorWallet.balance -= amount;
  await donorWallet.save();

  const beneficiaryWallet = await Wallet.findOne({ userId: beneficiaryId });
  if (beneficiaryWallet) {
    beneficiaryWallet.balance += amount;
    await beneficiaryWallet.save();
  }

  const donationCount = await Donation.countDocuments({ donorId });
  if (donationCount >= 2) {
    const donor = await User.findById(donorId);
    if (donor) {
      await sendThankYouMessage(donor.email);
    }
  }

  res.status(201).json({ message: 'Donation created successfully' });
});

export const getDonationCount = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const count = await Donation.countDocuments({ donorId: userId });
  res.json({ count });
});

export const getDonationsByPeriod = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;
  const donations = await Donation.find({
    donorId: userId,
    createdAt: { $gte: startDate, $lte: endDate }
  });
  res.json(donations);
});

export const getSingleDonation = asyncHandler(async (req: Request, res: Response) => {
  const { donationId } = req.params;
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new ErrorObject('Donation not found', 404);
  }
  res.json(donation);
});
