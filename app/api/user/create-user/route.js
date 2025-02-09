import bcrypt from "bcrypt";
import { calculateAge } from "@/utils/utilFunctions";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
 try {
    const { email, password, name,phoneNumber, state, city, dob, gender, profileCreatedBy } = await req.json();


    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where : {email}
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const existingPhoneCheck = await prisma.user.findUnique({
      where : {phoneNumber}
    })

    if (existingPhoneCheck) {
      return NextResponse.json({ error: "Phone Number Already Exists" }, { status: 400 });
    }


    const calculatedAge = calculateAge(dob);
    const age = calculatedAge.toString();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data : {
        name,
        email,
        password : hashedPassword,
        phoneNumber,
        city,
        state,
        gender,
        dob,
        profileCreatedBy,
        age
      }
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
 } catch (error) {
    console.log(error.message || error);
    return NextResponse.json({message : "Internal Server Error"}, {status : 500})
 }
}



export async function GET(req){
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where : {id : userId}
    })

    if (user) {
      return NextResponse.json(user, { status: 200 });
  } else {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
  }
  } catch (error) {
        console.error("BAISC USER RETRIEVAL: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}



export async function PUT(req){
  try {
    const {userId, city, state} = await req.json();

    const updatedUser = await prisma.user.update({
      where : {id : userId},
      data : {
        city,
        state
      }
    })

    return NextResponse.json({message : "User Updated Succesfully"}, {status : 200})


  } catch (error) {
    return NextResponse.json({error : "Internal Server Error"}, {status : 500})
  }
}


export async function DELETE(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Delete associated data in dependent tables
    await prisma.personalDetails.deleteMany({ where: { userId } });
    await prisma.partnerPreferences.deleteMany({ where: { userId } });
    await prisma.religiousDetails.deleteMany({ where: { userId } });
    await prisma.images.deleteMany({ where: { userId } });

    // Delete the main user record
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User and associated data deleted successfully", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
