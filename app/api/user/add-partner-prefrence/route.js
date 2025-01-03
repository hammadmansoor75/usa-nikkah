import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req){
    try {

        const {
            gender,
            ageGroupFrom,
            ageGroupTo,
            state,
            maritalStatus,
            religiousPreference,
            ethnicityPreference,
            educationLevel,
            work,
            considerSomeoneHavingChildren,
            smoke ,
            hijab,
            userId
        } = await req.json();

        let partnerPrefrences;

        if(gender === 'male'){
            partnerPrefrences = await prisma.partnerPreferences.create({
                data : {
                    gender,
                    ageGroupFrom,
                    ageGroupTo,
                    state,
                    maritalStatus,
                    religiousPreference,
                    ethnicityPreference,
                    educationLevel,
                    work,
                    considerSomeoneHavingChildren,
                    hijab,
                    userId
                }
            })
        }else{
            partnerPrefrences = await prisma.partnerPreferences.create({
                data : {
                    gender,
                    ageGroupFrom,
                    ageGroupTo,
                    state,
                    maritalStatus,
                    religiousPreference,
                    ethnicityPreference,
                    educationLevel,
                    work,
                    considerSomeoneHavingChildren,
                    smoke,
                    userId
                }
            })
        }

        if(partnerPrefrences){
            return NextResponse.json(partnerPrefrences, {status : 200})
        }else{
            return NextResponse.json({error : "Internal Server Error"}, {status : 500});
        }
        
    } catch (error) {
        console.error("PARTNER PREFRENCES CREATION: ", error)
        return NextResponse.json({error : "Internal Server Error"}, {status : 500});
    }
}

export async function GET(req) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const partnerPreferences = await prisma.partnerPreferences.findUnique({
            where: { userId },
        });

        if (partnerPreferences) {
            return NextResponse.json(partnerPreferences, { status: 200 });
        } else {
            return NextResponse.json({ error: "Preferences not found" }, { status: 201 });
        }
    } catch (error) {
        console.error("PARTNER PREFERENCES RETRIEVAL: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const {
            gender,
            ageGroupFrom,
            ageGroupTo,
            state,
            maritalStatus,
            religiousPreference,
            ethnicityPreference,
            educationLevel,
            work,
            considerSomeoneHavingChildren,
            smoke,
            hijab,
            userId
        } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedPreferences = await prisma.partnerPreferences.update({
            where: { userId },
            data: {
                gender,
                ageGroupFrom,
                ageGroupTo,
                state,
                maritalStatus,
                religiousPreference,
                ethnicityPreference,
                educationLevel,
                work,
                considerSomeoneHavingChildren,
                smoke,
                hijab,
            },
        });

        return NextResponse.json(updatedPreferences, { status: 200 });
    } catch (error) {
        console.error("PARTNER PREFERENCES UPDATE: ", error);

        if (error.code === "P2025") { // Prisma specific error for record not found
            return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

