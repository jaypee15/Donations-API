import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
}

const walletSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 },
});

export default mongoose.model<IWallet>('Wallet', walletSchema);
