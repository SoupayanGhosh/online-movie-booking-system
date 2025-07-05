import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { DatabaseService } from '@/lib/db'
import { Payment, PaymentInput } from '@/models/Payment'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyId',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourKeySecret',
})

export async function GET() {
  try {
    const db = await DatabaseService.getInstance()
    const payments = await db.getPayments()
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const paymentInput: PaymentInput = await request.json()
    
    // Validate required fields
    if (!paymentInput.userId || !paymentInput.bookingId || !paymentInput.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(paymentInput.amount * 100), // amount in paise
      currency: 'INR',
      receipt: paymentInput.bookingId,
      payment_capture: true, // set as boolean
    });

    // Optionally, save the payment/order in your DB
    const db = await DatabaseService.getInstance()
    const result = await db.createPayment(paymentInput)

    return NextResponse.json({
      order,
      payment: result
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
} 