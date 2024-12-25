import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import jwt from 'jsonwebtoken' // You'll need to install this package to generate JWT tokens
import { cookies } from 'next/headers' // To access and set cookies

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key' // Replace with your own secret key

export async function POST(req) {
  try {
    // Parse the incoming JSON body
    const { supabaseAuthId } = await req.json()

    // Find the user by supabaseAuthId
    const user = await prisma.user.findUnique({
      where: {
        supabaseAuthId,
      },
    })

    console.log("USER IN LOGIN:", user);

    // If the user is found, create a JWT token and set it in the cookies
    if (user) {
      // Generate a token with the user's id or any other information you want to include
      const token = jwt.sign({ userId: user.id, supabaseAuthId: user.supabaseAuthId, gender:user.gender, phone:user.phone }, SECRET_KEY, {
        expiresIn: '12h', // Token expiration time
      })

      // Set the token in the cookies
      const cookieStore = await cookies()
      cookieStore.set('authToken', token, {
        httpOnly: true, // Ensures the cookie is not accessible by client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Only set as secure in production
        maxAge: 60 * 60 * 12, // 1 hour expiration for the cookie
        path: '/', // Available site-wide
        sameSite: 'Strict', // Prevents the cookie from being sent cross-site
      })

      // Respond with the user data
      return NextResponse.json({ user }, { status: 200 })
    } else {
      // If the user is not found, return a 404 response
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error verifying login:', error)
    return NextResponse.json({ error: 'An error occurred while verifying login' }, { status: 500 })
  }
}
