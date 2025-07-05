import mongoose, { Schema, model, models } from "mongoose";
import { ObjectId } from 'mongodb'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const UserModel = models.User || model("User", UserSchema);

export interface User {
  _id?: ObjectId
  email: string
  password: string // Will be hashed
  firstName: string
  lastName: string
  phoneNumber?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

export interface UserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export default UserModel;
