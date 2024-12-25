import prisma from "@/prisma/client";

export async function GET(req) {
  try {
    const loggedInUserId = req.nextUrl.searchParams.get("userId");

    // Validate input
    if (!loggedInUserId) {
      return new Response(
        JSON.stringify({ error: "Logged-in user ID is required" }),
        { status: 400 }
      );
    }

    // Fetch users who have shortlisted the logged-in user
    const user = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: {
        shortlistedBy: true, // Get the `shortlistedBy` array
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    const shortlistedByIds = user.shortlistedBy || [];

    // Fetch detailed information about those users
    const shortlistedByUsers = await prisma.user.findMany({
      where: {
        id: { in: shortlistedByIds }, // Match IDs in the `shortlistedBy` array
      },
    });

    return new Response(
      JSON.stringify({ shortlistedBy: shortlistedByUsers }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shortlisted by users:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
