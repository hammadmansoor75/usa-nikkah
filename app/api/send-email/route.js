import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { Resend } from 'resend';



export async function POST(req) {
  try {
    const { email } = await req.json();

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Generate a secure token
    // const resetToken = crypto.randomBytes(32).toString("hex");

    // // Hash the token for security before saving it in DB
    // const hashedToken = await hash(resetToken, 10);
    // const tokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

    // // Save token in database
    // await prisma.user.update({
    //   where: { email },
    //   data: { resetToken: hashedToken, resetTokenExpiry: tokenExpiry },
    // });

    // Send email with the reset link

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password`;

    const resend = new Resend('re_jVKsgYMp_NgKfPC6fEM838KXT4QjQv7EX');
    
    const response = await resend.emails.send({
        from: 'hammad@usanikkah.com',
        to: [email],
        subject: 'USA NIKKAHPassword Reset Email',
        html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link expires in 1 hour.</p>`
  });
  console.log(response)

    return NextResponse.json({ message: "Password reset link sent!" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
