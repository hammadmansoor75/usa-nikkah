import prisma from "@/prisma/client";

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
        matchedUsers: true, // Fetch the matchedUsers array
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    const matchedUserIds = user.matchedUsers || [];

    // Fetch detailed information about matched users
    const matchedUsers = await prisma.user.findMany({
      where: {
        id: { in: matchedUserIds },
      },
    });

    return new Response(
      JSON.stringify({ matchedUsers }),
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



export async function DELETE(req) {
  try {
    const { loggedInUserId, targetUserId } = await req.json();

    // Validate input
    if (!loggedInUserId || !targetUserId) {
      return new Response(
        JSON.stringify({ error: "Both logged-in user ID and target user ID are required" }),
        { status: 400 }
      );
    }

    // Remove target user from logged-in user's matchedUsers
    const updatedLoggedInUser = await prisma.user.update({
      where: { id: loggedInUserId },
      data: {
        matchedUsers: {
          set: (await prisma.user.findUnique({
            where: { id: loggedInUserId },
            select: { matchedUsers: true },
          }))?.matchedUsers.filter((id) => id !== targetUserId),
        },
      },
    });

    // Remove logged-in user from target user's matchedUsers
    const updatedTargetUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        matchedUsers: {
          set: (await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { matchedUsers: true },
          }))?.matchedUsers.filter((id) => id !== loggedInUserId),
        },
      },
    });

    return new Response(
      JSON.stringify({
        message: "Match removed successfully",
        updatedLoggedInUser,
        updatedTargetUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing matched user:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
