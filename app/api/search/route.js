import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { ageGroupFrom, ageGroupTo, state, city, maritalStatus, ethnicityPreference, gender } = await req.json();

        console.log(ageGroupFrom, ageGroupTo, state, city, maritalStatus, ethnicityPreference, gender)



        const currentYear = new Date().getFullYear();
        const minDate = ageGroupTo ? `${currentYear - ageGroupTo}-01-01` : undefined; // Earliest DOB for max age
        const maxDate = ageGroupFrom ? `${currentYear - ageGroupFrom}-12-31` : undefined; // Latest DOB for min age

        // Build the where clause dynamically
        const whereClause = {
            ...(minDate || maxDate ? { dob: {} } : {}), // Add `dob` filter if needed
            ...(minDate ? { dob: { gte: minDate } } : {}), // Add `gte` if `minDate` is defined
            ...(maxDate ? { dob: { lte: maxDate } } : {}), // Add `lte` if `maxDate` is defined
            state: state || undefined, // Filter by state if provided
            city: city || undefined, // Filter by city if provided
            gender: gender === 'male' ? 'female' : 'male', // Filter by gender if provided
            personalDetails: {
                ...(maritalStatus ? { maritalStatus } : {}), // Filter by marital status if provided
                ...(ethnicityPreference ? { ethnicBackground: ethnicityPreference } : {}), // Filter by ethnicity if provided
            },
        };

        // Query the database with dynamic filters
        const users = await prisma.user.findMany({
            where: {
                ...whereClause,
                personalDetails: maritalStatus || ethnicityPreference ? { 
                    ...whereClause.personalDetails 
                } : undefined, // Include nested conditions only if provided
            },
            include: {
                personalDetails: true, // Include personal details in the response
            },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("USER SEARCH ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
