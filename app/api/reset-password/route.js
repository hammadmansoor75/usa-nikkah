import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { hash, compare } from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
    // Find all users with a non-expired reset token
    const users = await prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        expiresAt: { gt: new Date() }, // Ensure token is not expired
      },
    });

    // Find the correct user by comparing the token with stored hashed tokens
    let matchedUser = null;
    for (const user of users) {
      const isValidToken = await compare(token, user.passwordResetToken);
      if (isValidToken) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password and clear reset token
    await prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Clear token after use
        expiresAt: null,
      },
    });

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("RESET PASSWORD ERROR: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
