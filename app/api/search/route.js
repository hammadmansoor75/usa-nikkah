import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { ageGroupFrom, ageGroupTo, state, city, maritalStatus, ethnicityPreference, gender } = await req.json();

        console.log(ageGroupFrom, ageGroupTo, state, city, maritalStatus, ethnicityPreference, gender);

        // Build the where clause dynamically
        const whereClause = {
            AND: [
                { adminVerificationStatus: true }, // Only fetch verified profiles
                ...(ageGroupFrom ? [{ age: { gte: ageGroupFrom } }] : []),
                ...(ageGroupTo ? [{ age: { lte: ageGroupTo } }] : []),
            ],
            state: state || undefined,
            city: city || undefined,
            gender: gender === 'male' ? 'female' : 'male',
            personalDetails: maritalStatus || ethnicityPreference ? {
                ...(maritalStatus ? { maritalStatus } : {}),
                ...(ethnicityPreference ? { ethnicBackground: ethnicityPreference } : {}),
            } : undefined,
        };

        // Query the database with dynamic filters
        const users = await prisma.user.findMany({
            where: whereClause,
            include: {
                personalDetails: true,
                images: {
                    where: { adminVerificationStatus: true }, // Only include verified images
                },
            },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("USER SEARCH ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
