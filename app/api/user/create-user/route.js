import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import jwt from 'jsonwebtoken' // You'll need to install this package to generate JWT tokens
import { cookies } from 'next/headers' // To access and set cookies

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key' // Replace with your own secret key

export async function POST(req) {
  try {
    // Parse the incoming JSON body
    const {
      phone,
      supabaseAuthId,
      name,
      email,
      city,
      state,
      gender,
      dob,
      profileCreatedBy,
    } = await req.json()

    // Create user in the database using Prisma
    const user = await prisma.user.create({
      data: {
        phone,
        supabaseAuthId,
        name,
        email,
        city,
        state,
        gender,
        dob,
        profileCreatedBy,
      },
    })

    // Generate a token with the user's id or any other information you want to include
    const token = jwt.sign(
      { userId: user.id, supabaseAuthId: user.supabaseAuthId, gender:user.gender, phone: user.phone },
      SECRET_KEY,
      { expiresIn: '12h' } // Set expiration time for the token (1 hour here)
    )

    // Set the token in the cookies
    const cookieStore = await cookies()
    cookieStore.set('authToken', token, {
      httpOnly: true, // Ensures the cookie is not accessible by client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Only set as secure in production
      maxAge: 60 * 60 * 12, // 1 hour expiration for the cookie
      path: '/', // Available site-wide
      sameSite: 'Strict', // Prevents the cookie from being sent cross-site
    })



    // If the user was created successfully, return a 201 status with the user data
    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 })
  }
}


export async function GET(req) {
    try {
      // Access the userId from query parameters
      const userId = req.nextUrl.searchParams.get('userId')
  
      // If userId is not provided, return an error
      if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      }
  
      // Find the user by their ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
  
      // If the user doesn't exist, return an error
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
  
      // Return the user data
      return NextResponse.json(user, { status: 200 })
    } catch (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'An error occurred while fetching the user' }, { status: 500 })
    }
}


export async function PUT(req) {
    try {
      // Parse the incoming JSON body
      const { userId, city, state } = await req.json()
  
      // Find the user by their ID and update their details
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          city,
          state,
        },
      })
  
      // If the user doesn't exist, return an error
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
  
      // Return the updated user data
      return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 })
    } catch (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'An error occurred while updating the user' }, { status: 500 })
    }
}



