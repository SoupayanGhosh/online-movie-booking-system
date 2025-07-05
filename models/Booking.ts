import mongoose, { Schema, model, models } from "mongoose";
import { ObjectId } from 'mongodb'

export interface Booking {
  _id?: ObjectId;
  userId: ObjectId;
  movieId: ObjectId;
  showTimeId: ObjectId;
  ticketCode: string;
  seats: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  showDate: Date;
  showTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingInput {
  userId: string;
  movieId: string;
  showTimeId: string;
  seats: number;
  totalAmount: number;
  showDate: Date;
  showTime: string;
}

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  showTimeId: { type: Schema.Types.ObjectId, required: true },
  ticketCode: {
    type: String,
    required: true,
    unique: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: { type: Date, default: Date.now },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
  },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  cancellationReason: { type: String },
  refundAmount: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add indexes for efficient querying
BookingSchema.index({ userId: 1, bookingDate: -1 });
BookingSchema.index({ showDate: 1, showTime: 1 });

const BookingModel = models.Booking || model("Booking", BookingSchema);
export default BookingModel; 