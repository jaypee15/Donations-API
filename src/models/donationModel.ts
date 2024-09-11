import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donorEmail: string;
  beneficiaryEmail: string;
  amount: number;
  createdAt: Date;
}

const donationSchema = new Schema({
  donorEmail: { type: String, required: true },
  beneficiaryEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDonation>('Donation', donationSchema);
