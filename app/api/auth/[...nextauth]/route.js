import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import prisma from "@/prisma/client";

export const authOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : {label : "Email" , type : "email"},
                password : {label : "Password", type : "password"}
            },
            async authorize (credentials) {
                const existingUser = await prisma.user.findUnique({
                    where : {email : credentials.email}
                });

                if(!existingUser){
                    throw new Error("No User Found With This Email Address");
                }

                const isValid = await bcrypt.compare(credentials.password, existingUser.password);
                if(!isValid){
                    throw new Error("Invalid Password")
                }

                return {
                    id : existingUser.id,
                    name : existingUser.name,
                    email : existingUser.email,
                    city : existingUser.city,
                    state : existingUser.state,
                    gender : existingUser.gender,
                    dob : existingUser.dob,
                    age : existingUser.age,
                    profileCreatedBy : existingUser.profileCreatedBy,
                    adminVerificationStatus : existingUser.adminVerificationStatus
                }
            }
        })
    ],
    pages : {
        signIn : "/auth/login"
    },
    session : {
        strategy : "jwt"
    },
    callbacks : {
        async jwt ({token,user}) {
            if(user){
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.city = user.city;
                token.state = user.state;
                token.gender = user.gender;
                token.age = user.age;
                token.dob = user.dob;
                token.profileCreatedBy = user.profileCreatedBy
                token.adminVerificationStatus = user.adminVerificationStatus
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.city = token.city
                session.user.state = token.state
                session.user.gender = token.gender
                session.user.dob = token.dob
                session.user.age = token.age
                session.user.profileCreatedBy = token.profileCreatedBy
                session.user.adminVerificationStatus = token.adminVerificationStatus
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}

