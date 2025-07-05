import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { User, UserInput } from '@/models/user'
import bcrypt from 'bcryptjs'
import { csrfMiddleware } from '@/lib/middleware'

export async function GET() {
  try {
    const db = await DatabaseService.getInstance()
    const users = await db.getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 })
  }
}

const postHandler = async function POST(request: Request) {
  try {
    const userInput: UserInput = await request.json()

    // Validate required fields
    if (!userInput.email || !userInput.password || !userInput.firstName || !userInput.lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await DatabaseService.getInstance()

    // Check for existing user
    const existingUser = await db.getUserByEmail(userInput.email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userInput.password, 10)
    const newUser = {
      ...userInput,
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await db.createUser(newUser)

    // Return only safe user data
    return NextResponse.json({
      id: result._id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      role: result.role,
      isVerified: result.isVerified
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export const POST = csrfMiddleware(postHandler)