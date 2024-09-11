import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Donation from '../models/donationModel';
import User from '../models/userModel';
import Wallet from '../models/walletModel';
import { sendThankYouMessage } from '../services/communicationService';
import { ErrorObject } from '../utils/error';
import { IUser } from '../models/userModel';

export const createDonation = asyncHandler(async (req: Request, res: Response) => {
  const { beneficiaryEmail, amount } = req.body;
  const donorEmail = (req.user as IUser)?.email

  const donor = await User.findOne({ email: donorEmail });
  const beneficiary = await User.findOne({ email: beneficiaryEmail });

  if (!donor) {
    throw new ErrorObject("Donor not found", 404);
  }

  const donorWallet = await Wallet.findOne({ userId: donor._id });
  if (!donorWallet || donorWallet.balance < amount) {
    throw new ErrorObject("Insufficient balance", 400);
  }

  const donation = new Donation({ donorEmail, beneficiaryEmail, amount });
  await donation.save();

  donorWallet.balance -= amount;
  await donorWallet.save();

  const beneficiaryWallet = await Wallet.findOne({ userId: beneficiary?._id });
  if (beneficiaryWallet) {
    beneficiaryWallet.balance += amount;
    await beneficiaryWallet.save();
  }

  const donationCount = await Donation.countDocuments({ donorEmail });
  if (donationCount >= 2) {
    await sendThankYouMessage(donor.email);
  }

  res.status(201).json({ message: `Donation successfull: you sent ${amount} points to ${beneficiaryEmail}` });
});

export const getDonationCount = asyncHandler(async (req: Request, res: Response) => {
  const donorEmail = (req.user as IUser)?.email;

  if (!donorEmail) {
    throw new ErrorObject("Unauthorized: User email not found", 401);
  }

  const count = await Donation.countDocuments({ donorEmail });
  res.json({ count });
});

export const getDonationsByPeriod = asyncHandler(async (req: Request, res: Response) => {
  const donorEmail = (req.user as IUser)?.email;

  if (!donorEmail) {
    throw new ErrorObject("Unauthorized: User email not found", 401);
  }

  const { startDate, endDate } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const startIndex = (page - 1) * limit;

  const totalDonations = await Donation.countDocuments({
    donorEmail,
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const donations = await Donation.find({
    donorEmail,
    createdAt: { 
      $gte: new Date(startDate as string), 
      $lte: new Date(new Date(endDate as string).setHours(23, 59, 59, 999))
    }
  })
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    currentPage: page,
    totalPages: Math.ceil(totalDonations / limit),
    totalDonations,
    donations
  });
});

export const getSingleDonation = asyncHandler(async (req: Request, res: Response) => {
  const { donationId } = req.params;
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new ErrorObject('Donation not found', 404);
  }
  res.json(donation);
});
