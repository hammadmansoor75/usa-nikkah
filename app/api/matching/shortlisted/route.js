import prisma from "@/prisma/client";

export async function POST(req) {
  try {
    const { loggedInUserId, targetUserId } = await req.json();

    if (!loggedInUserId || !targetUserId) {
      return new Response(
        JSON.stringify({ error: "Logged-in user ID and target user ID are required" }),
        { status: 400 }
      );
    }

    // Fetch the logged-in user
    const loggedInUser = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { shortlistedUsers: true },
    });

    if (!loggedInUser) {
      return new Response(
        JSON.stringify({ error: "Logged-in user not found" }),
        { status: 404 }
      );
    }

    // Check if the target user is already in the logged-in user's shortlistedUsers array
    if (loggedInUser.shortlistedUsers.includes(targetUserId)) {
      return new Response(
        JSON.stringify({ error: "User is already shortlisted" }),
        { status: 400 }
      );
    }

    // Fetch the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { shortlistedBy: true },
    });

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "Target user not found" }),
        { status: 404 }
      );
    }

    // Check if the logged-in user is already in the target user's shortlistedBy array
    // if (targetUser.shortlistedBy.includes(loggedInUserId)) {
    //   return new Response(
    //     JSON.stringify({ error: "You are already in the target user's shortlistedBy list" }),
    //     { status: 400 }
    //   );
    // }

    // Update the logged-in user's shortlistedUsers array
    const updatedLoggedInUser = await prisma.user.update({
      where: { id: loggedInUserId },
      data: {
        shortlistedUsers: { push: targetUserId },
      },
    });

    // Update the target user's shortlistedBy array
    const updatedTargetUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        shortlistedBy: { push: loggedInUserId },
      },
    });

    return new Response(
      JSON.stringify({
        message: "User shortlisted successfully",
        updatedLoggedInUser,
        updatedTargetUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding user to shortlisted:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}





export async function GET(req) {
  try {
    // Get the logged-in user's ID from the query or headers
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400 }
      );
    }

    // Fetch the logged-in user's shortlistedUsers list
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        shortlistedUsers: true, // Only fetch shortlistedUsers
      },
    });

    if (!loggedInUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Fetch the details of the shortlisted users
    const shortlistedUsers = await prisma.user.findMany({
      where: {
        id: { in: loggedInUser.shortlistedUsers }, // Find users with IDs in shortlistedUsers
      },
    });

    return new Response(
      JSON.stringify({ shortlistedUsers }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching shortlisted users:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
    try {
      const { loggedInUserId, targetUserId } = await req.json();
  
      if (!loggedInUserId || !targetUserId) {
        return new Response(
          JSON.stringify({ error: 'Logged in user ID and target user ID are required' }),
          { status: 400 }
        );
      }
  
      // Remove the target user from the logged-in user's shortlistedUsers list
      const loggedInUser = await prisma.user.findUnique({
        where: { id: loggedInUserId },
        select: { shortlistedUsers: true },
      });
      
      if (!loggedInUser) {
        throw new Error('Logged in user not found');
      }
      
      // Remove the targetUserId from the list
      const updatedShortlistedUsers = loggedInUser.shortlistedUsers.filter(
        (userId) => userId !== targetUserId
      );
      
      const updatedUser = await prisma.user.update({
        where: { id: loggedInUserId },
        data: { shortlistedUsers: { set: updatedShortlistedUsers } },
      });
      
  
      return new Response(
        JSON.stringify({ updatedUser }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error removing user from shortlisted:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
    }
  }

