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

    // Check if the logged-in user is already shortlisted by the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { prospectiveMatch: true },
    });

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "Target user not found" }),
        { status: 404 }
      );
    }

    const isSelectedByTarget = targetUser.prospectiveMatch.includes(loggedInUserId);

    if (isSelectedByTarget) {
      // Add each user to the other's matchedUsers
      const [updatedLoggedInUser, updatedTargetUser] = await Promise.all([
        prisma.user.update({
          where: { id: loggedInUserId },
          data: {
            matchedUsers: {
              push: targetUserId, // Add target user to logged-in user's matchedUsers
            },
          },
        }),
        prisma.user.update({
          where: { id: targetUserId },
          data: {
            matchedUsers: {
              push: loggedInUserId, // Add logged-in user to target user's matchedUsers
            },
          },
        }),
      ]);

      return new Response(
        JSON.stringify({ message: "Users matched!", updatedLoggedInUser, updatedTargetUser }),
        { status: 201 }
      );
    }

    // If not shortlisted by the target user, add to shortlistedUsers
    const updatedUser = await prisma.user.update({
      where: { id: loggedInUserId },
      data: {
        prospectiveMatch: {
          push: targetUserId, // Add the target user to the shortlistedUsers array
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "User Selected For A Match", updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding user to Prospective Match:", error);
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
        prospectiveMatch: true, // Only fetch shortlistedUsers
      },
    });

    if (!loggedInUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Fetch the details of the shortlisted users
    const prospectiveMatchUsers = await prisma.user.findMany({
      where: {
        id: { in: loggedInUser.prospectiveMatch }, // Find users with IDs in shortlistedUsers
      },
    });

    return new Response(
      JSON.stringify({ prospectiveMatchUsers }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Prospective Match users:', error);
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
        select: { prospectiveMatch: true },
      });
      
      if (!loggedInUser) {
        throw new Error('Logged in user not found');
      }
      
      // Remove the targetUserId from the list
      const updatedShortlistedUsers = loggedInUser.prospectiveMatch.filter(
        (userId) => userId !== targetUserId
      );
      
      const updatedUser = await prisma.user.update({
        where: { id: loggedInUserId },
        data: { prospectiveMatch: { set: updatedShortlistedUsers } },
      });
      
  
      return new Response(
        JSON.stringify({ updatedUser }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error removing user from prospective match:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
    }
  }

