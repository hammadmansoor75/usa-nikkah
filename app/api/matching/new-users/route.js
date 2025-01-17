import prisma from "@/prisma/client";



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

    // Fetch the logged-in user from the database
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        shortlistedUsers: true,
        blockedUsers: true,
        matchedUsers: true,
        profileViews: true,
        gender : true
      },
    });

    if (!loggedInUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Combine all interacted users
    const interactedUserIds = [
      ...loggedInUser.shortlistedUsers,
      ...loggedInUser.blockedUsers,
      ...loggedInUser.matchedUsers,
    ];

    // console.log("Logged in Gender", loggedInUser.gender)

    const oppositeGender = loggedInUser.gender === 'male' ? 'female' : 'male';
    // Fetch users who have not interacted with the logged-in user
    const newUsers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: loggedInUser.id } }, // Exclude the logged-in user
          { id: { notIn: interactedUserIds } },
          { gender: oppositeGender }, // Exclude interacted users
        ],
      }, 
    });

    // Return the new users
    return new Response(
      JSON.stringify({ newUsers }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching new users:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
