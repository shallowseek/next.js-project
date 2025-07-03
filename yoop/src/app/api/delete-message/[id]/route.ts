import  getServerSession  from "next-auth";
// getServerSession() is a helper function provided by NextAuth.js.
// It is used on the server-side (like inside API routes, middleware, or server components) to get the current user's session.
// It reads the cookies from the request and validates the session using the authOptions.
import { authOptions } from "../../auth/[...nextauth]/options"
import UserModel from "../../../../model/user.model"
import dbConnect from "@/lib/dbConnect"
import { User, Session } from "next-auth"
import mongoose, { trusted } from "mongoose";

//first we will explore whether user first is logined or not


export async function DELETE(request:Request, {params}:{params:{messageId:string}}){
    const id = params.messageId;
    console.log("this is the message id",id)
    await dbConnect();
    // 1. get current logged in user
    const session: Session = await getServerSession(authOptions) 
    const user = session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})

    }


    try {
        const updatedResult = await UserModel.updateOne(
                            {_id:user._id},
                            //after finding user, he has array of messages
                        {$pull:{messages:{_id:id}}} 
                        )
        if(updatedResult.modifiedCount===0){
            // The number of documents that were modified
        
                    return Response.json({
            success:false,
            message:"fail to delete"
        },{status:404})
        }
        else{
                       return Response.json({
            success:true,
            message:"Message Deleted"
        },{status:202})
        }
    }
    
    catch (error) {
        console.log("error in deleting message====>>>>>",error)
          return Response.json({
            success:false,
            message:"Error deleting Message"
        },{status:500})
        
    }
    
}