import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "../../../lib/dbConnect";// we have to connect database on every route//
import UserModel from "../../../models/user.model";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect()


    try {
        const{username,password,email}= await request.json()
        const  verifyCode = Math.floor(100000+Math.random()*900000).toString()
        //first will check if username exists in database
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,// Same as username: username
            isVerified:true  
            // "Find me the first user in the database who has this exact username AND is already verified"          
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


        const existingUserByEmail = await UserModel.findOne({email})
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return   Response.json({
                success:false,
                message:"email is already registered"
            },
            {
                status:400
            }
        )
            }

            else{
               const encryptedPassword =  await bcrypt.hash(password,10)
               existingUserByEmail.password = encryptedPassword
               existingUserByEmail.verifyCode = verifyCode
               existingUserByEmail.verifyCodeExpires= new Date(Date.now()+ 3600000)
               await existingUserByEmail.save()
            }
        }
        else{// if we don't find user with email in database then we have to register and before that we have to hash password
           const encryptedPassword =  await bcrypt.hash(password,10)
           const expiryDate = new Date();
//            new Date() creates a Date object at memory address (let's say 0x1234)
// expiryDate holds a reference to that memory location
// setHours() mutates the object at 0x1234
// expiryDate still points to the same location, but the object's value changed
           // Add 1 hour to current time
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = await new UserModel({
                name: username,
                  username: username,
                  email: email,
                  password: encryptedPassword,
                  verifyCode,
                  verifyCodeExpires: expiryDate,//we have set date in typescript//
                  isVerified: false, // Optional property
                  isAcceptedMessage: true,
                  messages: []
            })
            await newUser.save()
            console.log("tbis is the new user created",newUser)


        }
        //send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        console.log("this is the email response from resend-email",emailResponse)
        if(!emailResponse.success){
            return Response.json({
                sucess:false,
                message:emailResponse.message
            },{status:500})

//             Success Response:
//             {
//   data: {
//     id: "re_1234567890abcdef",     // Unique email ID for tracking
//     from: "you@example.com",       
//     to: ["user@example.com"],      
//     created_at: "2025-06-17T10:30:00.000Z"
//   },
//   error: null
// }

// Error Response:
// {
//   data: null,
//   error: {
//     name: "validation_error",
//     message: "Invalid email address"
//   }
// }
        }
        return Response.json({
                sucess:true,
                message:"user registered succesfully"
            },{status:200})



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
