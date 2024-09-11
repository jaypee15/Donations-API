import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  beneficiaryId: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const donationSchema = new Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDonation>('Donation', donationSchema);
