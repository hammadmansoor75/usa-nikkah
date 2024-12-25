import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { loggedInUserId, targetUserId } = await req.json();

    console.log(loggedInUserId, targetUserId )

    if (!loggedInUserId || !targetUserId) {
        return NextResponse.json({ error: "Logged-in user ID and target user ID are required" }, {status : 400})
    }

    // Update the target user's profileViews list to add the logged-in user
    const updatedTargetUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        profileViews: {
          push: loggedInUserId, // Adds the logged-in user to the profileViews array of the target user
        },
      },
    });

    return NextResponse.json({ message: "View Added" }, {status : 200})
  } catch (error) {
    console.error("Error adding profile view:", error);
    return NextResponse.json({ error: "Internal Server Error" }, {status : 400})
  }
}

export async function GET(req) {
    try {
      const loggedInUserId = req.nextUrl.searchParams.get("userId");
  
      if (!loggedInUserId) {
        return new Response(
          JSON.stringify({ error: "Logged-in user ID is required" }),
          { status: 400 }
        );
      }
  
      // Fetch matched user IDs for the logged-in user
      const user = await prisma.user.findUnique({
        where: { id: loggedInUserId },
        select: {
          profileViews: true, // Fetch the matchedUsers array
        },
      });
  
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404 }
        );
      }
  
      const profileViewIds = user.profileViews || [];
  
      // Fetch detailed information about matched users
      const viewUsers = await prisma.user.findMany({
        where: {
          id: { in: profileViewIds },
        },
        include : {
            personalDetails : true
        }
      });
  
      return new Response(
        JSON.stringify({ viewUsers }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching matched users:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 }
      );
    }
  }
