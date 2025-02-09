import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {email} = await req.json();

        const user = await prisma.user.findUnique({
            where : {email},
            include : {
                personalDetails : true,
                partnerPrefrences : true,
                relegiousDetails : true,
                images : true
            }
        })

        if(user){
            return NextResponse.json(user, {status : 200})
        }else{
            return NextResponse.json({error : "User not found"}, {status : 400})
        }
    } catch (error) {
        console.error("BASIC USER RETRIEVAL BY EMAIL: ", error);
        return NextResponse.json({error : "Internal Server Error"}, {status : 500})
    }
}