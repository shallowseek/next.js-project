import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "../../lib/dbConnect";// we have to connect database on every route//
import UserModel from "../../models/user.model";
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect()

    try {
        const{username,password,email}= await request.json()
        //first will check if username exists in database
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true            
        })
        //if user with same username exists then we will reject data send by user.
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },
            {
                status:400
            }
        )
        }
    } catch (error) {
        console.error("error registering user",error)
        return Response.json({
            success:false,
            message:"Error registering User"
    
        },
    {
        status:500
    })
        
    }
}
