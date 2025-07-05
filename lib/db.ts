import mongoose, { Document } from 'mongoose';
import '@/models/user';
import '@/models/movie';
import '@/models/Booking';
import '@/models/Payment';
import { User, UserInput } from '@/models/user'
import { Movie, MovieInput, ShowTime } from '@/models/movie'
import { Booking, BookingInput } from '@/models/Booking'
import { Payment, PaymentInput } from '@/models/Payment'
import { ObjectId } from 'mongodb'
import { generateTicketCode, validateSeatAvailability, calculateTotalPrice } from './utils';
import { MONGODB_CONFIG } from './config';
import { connectToDatabase } from './mongoose';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export class DatabaseService {
  private static instance: DatabaseService

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User Operations
  async createUser(userInput: UserInput): Promise<User> {
    await connectToDatabase();
    try {
      const UserModel = mongoose.model('User');
      const user = new UserModel({
        ...userInput,
        role: 'user',
        isVerified: false
      });
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await connectToDatabase();
    try {
      const UserModel = mongoose.model('User');
      const user = await UserModel.findOne({ email });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await connectToDatabase();
    try {
      const UserModel = mongoose.model('User');
      await UserModel.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error updating user last login:', error);
      throw new Error('Failed to update user last login');
    }
  }

  // Movie Operations
  async createMovie(movieInput: MovieInput): Promise<Movie> {
    await connectToDatabase();
    try {
      const MovieModel = mongoose.model('Movie');
      const movie = new MovieModel({
        ...movieInput,
        isActive: true
      });
      const savedMovie = await movie.save();
      return savedMovie.toObject();
    } catch (error) {
      console.error('Error creating movie:', error);
      throw new Error('Failed to create movie');
    }
  }

  async getActiveMovies(): Promise<Movie[]> {
    await connectToDatabase();
    try {
      const MovieModel = mongoose.model('Movie');
      const movies = await MovieModel.find({ isActive: true });
      return movies.map(movie => movie.toObject());
    } catch (error) {
      console.error('Error fetching active movies:', error);
      throw new Error('Failed to fetch movies');
    }
  }

  // Booking Operations
  async validateAndCreateBooking(bookingInput: BookingInput): Promise<{ booking: Booking | null; error?: string }> {
    await connectToDatabase();
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();

      // 1. Get the showtime details
      const MovieModel = mongoose.model<Movie & Document>('Movie');
      const movie = await MovieModel.findOne({
        _id: new ObjectId(bookingInput.movieId),
        'showTimes._id': new ObjectId(bookingInput.showTimeId)
      }).session(session);

      if (!movie) {
        await session.abortTransaction();
        return { booking: null, error: 'Movie or showtime not found' };
      }

      // 2. Find the specific showtime
      const showTime = movie.showTimes.find(
        (st: ShowTime) => st._id?.toString() === bookingInput.showTimeId
      );

      if (!showTime) {
        await session.abortTransaction();
        return { booking: null, error: 'Showtime not found' };
      }

      // 3. Validate seat availability
      const validation = validateSeatAvailability(
        showTime.availableSeats,
        bookingInput.seats
      );

      if (!validation.isValid) {
        await session.abortTransaction();
        return { booking: null, error: validation.message };
      }

      // 4. Calculate total amount
      const totalAmount = calculateTotalPrice(showTime.price, bookingInput.seats);

      // 5. Create the booking
      const BookingModel = mongoose.model<Booking & Document>('Booking');
      const ticketCode = generateTicketCode(bookingInput.movieId, bookingInput.showTimeId);
      
      const booking = new BookingModel({
        ...bookingInput,
        userId: new ObjectId(bookingInput.userId),
        movieId: new ObjectId(bookingInput.movieId),
        showTimeId: new ObjectId(bookingInput.showTimeId),
        ticketCode,
        totalAmount,
        status: 'pending',
        bookingDate: new Date()
      });

      // 6. Update available seats
      await MovieModel.updateOne(
        {
          _id: new ObjectId(bookingInput.movieId),
          'showTimes._id': new ObjectId(bookingInput.showTimeId)
        },
        {
          $inc: {
            'showTimes.$.availableSeats': -bookingInput.seats
          }
        }
      ).session(session);

      // 7. Save the booking
      const savedBooking = await booking.save({ session });

      await session.commitTransaction();
      return { booking: savedBooking.toObject() as Booking };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error in validateAndCreateBooking:', error);
      return { 
        booking: null, 
        error: error instanceof Error ? error.message : 'Failed to create booking' 
      };
    } finally {
      session.endSession();
    }
  }

  async getShowTimeAvailability(movieId: string, showTimeId: string): Promise<{
    available: boolean;
    availableSeats: number;
    price: number;
    error?: string;
  }> {
    await connectToDatabase();
    try {
      const MovieModel = mongoose.model<Movie & Document>('Movie');
      const movie = await MovieModel.findOne({
        _id: new ObjectId(movieId),
        'showTimes._id': new ObjectId(showTimeId)
      });

      if (!movie) {
        return {
          available: false,
          availableSeats: 0,
          price: 0,
          error: 'Movie or showtime not found'
        };
      }

      const showTime = movie.showTimes.find(
        (st: ShowTime) => st._id?.toString() === showTimeId
      );

      if (!showTime) {
        return {
          available: false,
          availableSeats: 0,
          price: 0,
          error: 'Showtime not found'
        };
      }

      // Check if showtime is in the past
      const [hours, minutes] = showTime.time.split(':').map(Number);
      const showDateTime = new Date(showTime.date);
      showDateTime.setHours(hours, minutes, 0, 0);

      if (showDateTime < new Date()) {
        return {
          available: false,
          availableSeats: 0,
          price: showTime.price,
          error: 'Showtime has already passed'
        };
      }

      return {
        available: showTime.availableSeats > 0,
        availableSeats: showTime.availableSeats,
        price: showTime.price
      };
    } catch (error) {
      console.error('Error checking showtime availability:', error);
      return {
        available: false,
        availableSeats: 0,
        price: 0,
        error: error instanceof Error ? error.message : 'Failed to check availability'
      };
    }
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    await connectToDatabase();
    try {
      const BookingModel = mongoose.model<Booking & Document>('Booking');
      const bookings = await BookingModel.find({ userId: new ObjectId(userId) });
      return bookings.map(booking => booking.toObject() as Booking);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch user bookings');
    }
  }

  async getActiveShowTimes(movieId: string, date: Date): Promise<ShowTime[]> {
    await connectToDatabase();
    try {
      const MovieModel = mongoose.model<Movie & Document>('Movie');
      const movie = await MovieModel.findOne({
        _id: new ObjectId(movieId),
        isActive: true,
        'showTimes.date': {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });

      if (!movie) {
        return [];
      }

      return movie.showTimes.filter((showTime: ShowTime) => {
        const showDate = new Date(showTime.date);
        return showDate >= new Date(date.setHours(0, 0, 0, 0)) &&
               showDate <= new Date(date.setHours(23, 59, 59, 999));
      });
    } catch (error) {
      console.error('Error fetching active showtimes:', error);
      throw new Error('Failed to fetch showtimes');
    }
  }

  async updateShowTimeSeats(movieId: string, showTimeId: string, seats: number): Promise<void> {
    await connectToDatabase();
    try {
      const MovieModel = mongoose.model<Movie & Document>('Movie');
      await MovieModel.updateOne(
        {
          _id: new ObjectId(movieId),
          'showTimes._id': new ObjectId(showTimeId)
        },
        {
          $inc: {
            'showTimes.$.availableSeats': seats
          }
        }
      );
    } catch (error) {
      console.error('Error updating showtime seats:', error);
      throw new Error('Failed to update showtime seats');
    }
  }

  // Payment Operations
  async createPayment(paymentInput: PaymentInput): Promise<Payment> {
    await connectToDatabase();
    try {
      const PaymentModel = mongoose.model<Payment & Document>('Payment');
      const payment = new PaymentModel({
        ...paymentInput,
        userId: new ObjectId(paymentInput.userId),
        bookingId: new ObjectId(paymentInput.bookingId),
        status: 'pending',
        paymentDate: new Date()
      });
      const savedPayment = await payment.save();
      return savedPayment.toObject() as Payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    await connectToDatabase();
    try {
      const PaymentModel = mongoose.model<Payment & Document>('Payment');
      await PaymentModel.findByIdAndUpdate(
        paymentId,
        {
          $set: {
            status,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  async getPayments(): Promise<Payment[]> {
    await connectToDatabase();
    try {
      const PaymentModel = mongoose.model<Payment & Document>('Payment');
      const payments = await PaymentModel.find();
      return payments.map(payment => payment.toObject() as Payment);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }

  async getUsers(): Promise<User[]> {
    await connectToDatabase();
    try {
      const UserModel = mongoose.model<User & Document>('User');
      const users = await UserModel.find();
      return users.map(user => user.toObject() as User);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getBookings(): Promise<Booking[]> {
    await connectToDatabase();
    try {
      const BookingModel = mongoose.model<Booking & Document>('Booking');
      const bookings = await BookingModel.find();
      return bookings.map(booking => booking.toObject() as Booking);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }
}

export const databaseService = DatabaseService.getInstance();