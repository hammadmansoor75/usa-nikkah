import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req){
    try{
        const {profilePhoto, selfiePhoto, photos, userId} = await req.json();

        const images = await prisma.images.create({
            data : {
                profilePhoto,
                selfiePhoto,
                photos,
                userId
            }
        })

        if(images){
            return NextResponse.json(images, {status : 200})
        }else{
            return NextResponse.json({error : "Internal Server Error"}, {status : 500});
        }

    }catch(error){
        console.error("PHOTOS CREATION: ", error)
        return NextResponse.json({error : "Internal Server Error"}, {status : 500});
    }
}


export async function GET(req) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const images = await prisma.images.findUnique({
            where: { userId },
        });

        if (images) {
            return NextResponse.json(images, { status: 200 });
        } else {
            return NextResponse.json({ error: "Images not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("IMAGES RETRIEVAL: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { photos, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedImages = await prisma.images.update({
            where: { userId },
            data: {
                photos,
            },
        });

        return NextResponse.json(updatedImages, { status: 200 });
    } catch (error) {
        console.error("IMAGES UPDATE: ", error);

        if (error.code === "P2025") { // Prisma specific error for record not found
            return NextResponse.json({ error: "Images not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

