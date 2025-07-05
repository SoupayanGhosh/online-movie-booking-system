import mongoose, { Schema, model, models } from "mongoose";
import { ObjectId } from 'mongodb'

export interface ShowTime {
  _id?: ObjectId;
  date: Date;
  time: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  hall: string;
}

export interface Movie {
  _id?: ObjectId;
  title: string;
  description: string;
  duration: number; // in minutes
  genre: string[];
  language: string;
  releaseDate: Date;
  posterUrl: string;
  trailerUrl?: string;
  director: string;
  cast: string[];
  rating: number;
  isActive: boolean;
  showTimes: ShowTime[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieInput {
  title: string;
  description: string;
  duration: number;
  genre: string[];
  language: string;
  releaseDate: Date;
  posterUrl: string;
  trailerUrl?: string;
  director: string;
  cast: string[];
  rating: number;
  showTimes: Omit<ShowTime, '_id'>[];
}

const ShowTimeSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  hall: {
    type: String,
    required: true
  }
});

const MovieSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    genre: [{
      type: String,
      required: true
    }],
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
    },
    posterUrl: {
      type: String,
      required: [true, "Poster URL is required"],
    },
    trailerUrl: String,
    director: {
      type: String,
      required: [true, "Director is required"],
    },
    cast: [{
      type: String,
      required: true
    }],
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    isActive: {
      type: Boolean,
      default: true
    },
    showTimes: [ShowTimeSchema]
  },
  { timestamps: true }
);

// Add index for efficient querying
MovieSchema.index({ 'showTimes.date': 1, 'showTimes.time': 1 });
MovieSchema.index({ isActive: 1, 'showTimes.date': 1 });

const MovieModel = models.Movie || model("Movie", MovieSchema);

export default MovieModel;
