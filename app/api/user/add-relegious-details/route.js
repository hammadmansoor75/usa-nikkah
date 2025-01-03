import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req){
    try {
        const {religiosity,
            prayer,
            revert,
            revertDuration,
            mosqueVisit,
            smoke,
            userId,
            hijab,
            considerWearingHijab
        } = await req.json();

        let relegiousDetails;

        if(smoke){
            relegiousDetails = await prisma.religiousDetails.create({
                data : {
                    religiosity,
                    prayer,
                    revert,
                    revertDuration,
                    mosqueVisit,
                    smoke,
                    userId,
                }
            })
        }

        if(hijab){
            relegiousDetails = await prisma.religiousDetails.create({
                data : {
                    religiosity,
                    prayer,
                    revert,
                    revertDuration,
                    mosqueVisit,
                    hijab,
                    considerWearingHijab,
                    userId,
                }
            })
        }

        if(relegiousDetails){
            return NextResponse.json(relegiousDetails, {status : 200})
        }else{
            return NextResponse.json({error : "Internal Server Error"}, {status : 500});
        }
        
    } catch (error) {
        console.error("RELEGIOUS DETAILS CREATION: ", error)
        return NextResponse.json({error : "Internal Server Error"}, {status : 500});
    }
}


export async function GET(req) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const religiousDetails = await prisma.religiousDetails.findUnique({
            where: {
                userId: userId,
            },
        });

        if (religiousDetails) {
            return NextResponse.json(religiousDetails, { status: 200 });
        } else {
            return NextResponse.json({ error: "Religious details not found" }, { status: 201 });
        }
    } catch (error) {
        console.error("RELEGIOUS DETAILS GET: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function PUT(req) {
    try {
        const { userId, religiosity, prayer, revert, revertDuration, mosqueVisit, smoke, hijab, considerWearingHijab } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Update religious details
        const updatedReligiousDetails = await prisma.religiousDetails.update({
            where: {
                userId: userId,
            },
            data: {
                religiosity,
                prayer,
                revert,
                revertDuration,
                mosqueVisit,
                smoke,
                hijab,
                considerWearingHijab,
            },
        });

        return NextResponse.json(updatedReligiousDetails, { status: 200 });
    } catch (error) {
        console.error("RELEGIOUS DETAILS UPDATE: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

