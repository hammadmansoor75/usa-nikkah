import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import jwt from 'jsonwebtoken' // To decode and verify the token
import { cookies } from 'next/headers' // To access the cookies

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key' // Replace with your own secret key

export async function GET(req) {
  try {
    // Retrieve the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value
    console.log("TOKEN:", token)

    // If token is not found in cookies, return an unauthorized error
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 })
    }

    // Verify and decode the token
    const decoded =  jwt.verify(token, SECRET_KEY)

    // Find the user by userId from the decoded token
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId, // Use the userId stored in the token
      },
    })

    // If the user is found, return the user data
    if (user) {
      return NextResponse.json(user, { status: 200 })
    } else {
      // If the user is not found, return a 404 response
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error extracting user:', error)
    // If token is invalid or an error occurs, return a 500 error
    return NextResponse.json({ error: 'An error occurred while extracting the user' }, { status: 500 })
  }
}
