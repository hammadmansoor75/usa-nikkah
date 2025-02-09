import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { randomBytes } from "crypto";
import { hash, compare } from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    console.log("BODY: ", body);
    console.log("EMAIL: ", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a secure reset token
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = await hash(resetToken, 10); // Hashing for security

    // Save hashed token in the database with expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30), // Token valid for 30 mins
      },
    });

    // Reset link (non-hashed token is sent in the link)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}&email=${email}`;

    // Send email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // API key from env variables
      },
      body: JSON.stringify({
        sender: { name: "USA Nikkah", email: "usanikkahofficial@gmail.com" },
        to: [{ email }],
        subject: "USA NIKKAH PASSWORD RESET EMAIL",
        htmlContent: `<h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 30 minutes.</p>`,
      }),
    });

    if (!response.ok) throw new Error("Failed to send email");

    return NextResponse.json({ message: "Reset email sent" }, { status: 200 });

  } catch (error) {
    console.error("SEND EMAIL ERROR: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
