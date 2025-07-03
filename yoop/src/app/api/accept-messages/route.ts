import getServerSession  from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/models/user.model"
import dbConnect from "@/lib/dbConnect"
import { User, Session } from "next-auth"

//ones which we have defined//


export async function POST(request:Request){
    // to toggle status of currently logged in user//
    await dbConnect()

    //1. get current logged in user
    // const session :any = await getServerSession(authOptions) as Session | null
     const session :any = await getServerSession(authOptions) 
    const user = session?.user
    if(!session || !session.user){
                return Response.json({
            success:false,
            message:"not authenticted"
        }, { status: 401 })}
    const user_id = user?._id;
    const {acceptMessage} = await request.json()// value we got from frontend when user toogle whther to accept message or not//
    //request.json() means we are parsing the body of request object
    //here we are assuming that user will send required data through request body and not params or form data//
    try {
       const updatedUser =  await UserModel.findByIdAndUpdate(
            user_id,
            {isAcceptedMessage:acceptMessage},
            {new:true}

        )//true will return updated document
        if (!updatedUser) {
             return Response.json({
            success:false,
            message:"no user found"
        }, { status: 401 })
            
        } else {
             return Response.json({
            success:true,
            message:"status updated succesfully",
             isAcceptingMessages:true
        }, { status: 200 })
            
        }
        
    } catch (error) {
          return Response.json({
            success:false,
            message:"failed to update user status to accep[t message"
        }, { status: 401 })
        
    }



}



export async function GET(request:Request){
  
    
    await dbConnect()

    //1. get current logged in user
    const session:any = await getServerSession(authOptions)
    const user = session?.user
    if(!session || !session.user){
                return Response.json({
            success:false,
            message:"not authenticted"
        }, { status: 401 })
    }
    const user_id = user?._id;
   try {
     const foundUser = await UserModel.findById(user_id)
     if (!foundUser) {
              return Response.json({
             success:false,
             message:"no user found"
         }, { status: 401 })
             
         } else {
              return Response.json({
             success:true,
             message:"status of user updated succesfully",
             isAcceptingMessages: foundUser?.isAcceptedMessage
         }, { status: 200 })
 
     
   } }
   catch (error) {
    console.log("this is the errorrrrr",error)
     return Response.json({
            success:false,
            message:"failed to get message acceptance status"
        }, { status: 500 })
    
   }


}

