import  getServerSession  from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/models/user.model"
import dbConnect from "@/lib/dbConnect"
import { User, Session } from "next-auth"
import mongoose from "mongoose";

//first we will explore whether user first is logined or not


export async function GET(request:Request){
    await dbConnect();
    // 1. get current logged in user
    const session: any = await getServerSession(authOptions) 
    const user = session?.user
    if(!session || !session.user){
                return Response.json({
            success:false,
            message:"not authenticted"
        }, { status: 401 })}
    const user_id = new mongoose.Types.ObjectId(user._id)
//     It converts user._id into a valid Mongoose ObjectId.
// In simple words:

//     If user._id is a string like "665c2f0b72be31a8ad77fb0a"

//     This line turns it into a Mongoose ObjectId object.
    //since we have stringufy user._id so it will create error in aggregation pipeline//
    try {
        // .aggregate() returns a Promise
        const messages = await UserModel.aggregate([
            // “Find the user with _id, take their messages array, flatten it, 
            // sort messages by timestamp, and then put it back into an array.”
            {$match:{_id:user_id}},
            {$unwind:'$messages'},
//             Breaks the messages array into separate documents (1 per message).

// So instead of:

// { _id: 1, messages: [msg1, msg2, msg3] }

// you get:

// { _id: 1, messages: msg1 }
// { _id: 1, messages: msg2 }
// { _id: 1, messages: msg3 }
            {$sort:{'messages.timestamp':-1}},
            // Sorts those documents by each message's timestamp (newest first).
            {$group:{_id:'$_id', messages:{$push:'$messages'}}}
//                     Regroups them by user _id, and pushes the sorted messages back into a messages array.

// ✅ What It Returns

// An array with one object, like this:

// [
//   {
//     "_id": "USER_OBJECT_ID",
//     "messages": [
//       {
//         "content": "Latest message",
//         "timestamp": "2024-06-26T11:00:00Z",
//         "_id": "messageId1"
//       },
//       {
//         "content": "Older message",
//         "timestamp": "2024-06-25T10:00:00Z",
//         "_id": "messageId2"
//       }
//     ]
//   }
// ]

//     The messages are sorted newest first!
        ])
if(!messages || messages.length===0)
{
     return Response.json({
            success:false,
            message:"no user and its messages found"
        }, { status: 401 })
}        

 return Response.json({
            success:true,
            message:"messages found successfuly",
            result:messages[0]?.messages|| []
        }, { status: 200})


    } 
    
    
    
    
    catch (error) {
         return Response.json({
            success:false,
            message:"no able to get messages"
        }, { status: 401 })}
        
    }
