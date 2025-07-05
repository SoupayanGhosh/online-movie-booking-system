import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { DatabaseService } from '@/lib/db'
import { Booking, BookingInput } from '@/models/Booking'

export async function GET() {
  try {
    const db = await DatabaseService.getInstance()
    const bookings = await db.getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const bookingInput: BookingInput = await request.json()
    
    // Validate required fields
    if (!bookingInput.userId || !bookingInput.movieId || !bookingInput.showTimeId || !bookingInput.seats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await DatabaseService.getInstance()
    const result = await db.createBooking(bookingInput)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 