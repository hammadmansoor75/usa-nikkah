import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req){
    try {
        const { 
            aboutMe, height, maritalStatus, children, childrenLiving, moreKids,
            ethnicBackground, occupation, hobbies, education, userId
          } = await req.json();

          if (!aboutMe || !height || !maritalStatus || !children || !childrenLiving || !moreKids ||
            !ethnicBackground || !occupation || !hobbies || !education || !userId) {
          return NextResponse.json({error : "All Fields are required"}, {status : 400});
        }

        const personalDetails = await prisma.personalDetails.create({
             // Assuming userId is sent in the request body
            data: {
              aboutMe,
              height,
              maritalStatus,
              children,
              childrenLiving,
              moreKids,
              ethnicBackground,
              occupation,
              hobbies,
              education,
              userId
            },
          });

        return NextResponse.json(personalDetails, {status : 200})


    } catch (error) {
        console.error("PERSONAL DETAILS CREATION: ", error)
        return NextResponse.json({error : "Internal Server Error"}, {status : 500});
    }
}


// GET method to retrieve personal details
export async function GET(req) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");
       // Assuming the userId is passed as a query parameter
  
       console.log(req.nextUrl.searchParams)
       console.log(userId)
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      // Fetch the personal details of the user
      const personalDetails = await prisma.personalDetails.findUnique({
        where: { userId: userId },
      });
  
      if (!personalDetails) {
        return NextResponse.json({ error: "Personal details not found" }, { status: 404 });
      }
  
      return NextResponse.json(personalDetails, { status: 200 });
    } catch (error) {
      console.error("PERSONAL DETAILS RETRIEVAL: ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
  // PUT method to update personal details
  export async function PUT(req) {
    try {
      const {
        aboutMe, height, maritalStatus, children, childrenLiving, moreKids,
        ethnicBackground, occupation, hobbies, education, userId
      } = await req.json();
  
      // Validate fields
      if (!aboutMe || !height || !maritalStatus || !children || !childrenLiving || !moreKids ||
        !ethnicBackground || !occupation || !hobbies || !education || !userId) {
        return NextResponse.json({ error: "All Fields are required" }, { status: 400 });
      }
  
      // Update personal details in the database
      const updatedPersonalDetails = await prisma.personalDetails.update({
        where: { userId: userId },
        data: {
          aboutMe,
          height,
          maritalStatus,
          children,
          childrenLiving,
          moreKids,
          ethnicBackground,
          occupation,
          hobbies,
          education,
        },
      });
  
      return NextResponse.json(updatedPersonalDetails, { status: 200 });
    } catch (error) {
      console.error("PERSONAL DETAILS UPDATE: ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }