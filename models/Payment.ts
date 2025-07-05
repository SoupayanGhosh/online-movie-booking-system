import mongoose, { Schema, model, models } from "mongoose";
import { ObjectId } from 'mongodb'

const PaymentDetailsSchema = new Schema({
  cardLast4: { type: String },
  cardType: { type: String },
  upiId: { type: String },
  bankName: { type: String }
}, { _id: false });

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
    required: true
  },
  transactionId: { type: String, required: true, unique: true },
  paymentDate: { type: Date, required: true },
  refundStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed']
  },
  refundAmount: { type: Number, min: 0 },
  refundDate: { type: Date },
  paymentDetails: { type: PaymentDetailsSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const PaymentModel = models.Payment || model("Payment", PaymentSchema);
export default PaymentModel;

export interface Payment {
  _id?: ObjectId
  userId: ObjectId
  bookingId: ObjectId
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking'
  transactionId: string
  paymentDate: Date
  createdAt: Date
  updatedAt: Date
  refundStatus?: 'pending' | 'completed' | 'failed'
  refundAmount?: number
  refundDate?: Date
  paymentDetails: {
    cardLast4?: string
    cardType?: string
    upiId?: string
    bankName?: string
  }
}

export interface PaymentInput {
  userId: string
  bookingId: string
  amount: number
  currency: string
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking'
  paymentDetails: {
    cardLast4?: string
    cardType?: string
    upiId?: string
    bankName?: string
  }
} 