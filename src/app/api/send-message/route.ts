import getServerSession  from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/models/user.model"
import { Message } from "@/models/user.model";
import dbConnect from "@/lib/dbConnect"
import { User, Session } from "next-auth"
import { timeStamp } from "console";

//ones which we have defined//


export async function POST(request:Request){
   //to register send message into databse and it is not necessary that user mustv be logged in//

    await dbConnect()


    const{username, content}= await request.json();
    try {
        //first we will find user in databse//
        const user = await UserModel.findOne({username});
        //if no user//
        if(!user){
            return Response.json(
                {success:false,
                message:"please register first"
                },{status:401})
        }
        // check if user is accepting messages//
        if(!user.isAcceptedMessage){
             return Response.json(
                {success:false,
                message:"user is not accepting message"
                },{status:403})
        }
        //if user found, then we will save message in that particular user document//
           // 3. Push new message to user's messages array
            //for that we need to craft a message//
            const newMessage = {content, timestamp:new Date()}
            // You're creating a plain object, not a full Mongoose Document —
            //  which Message (your interface) expects.
//             Message extends Document, which means it should include:

//     _id: ObjectId

//     .save() method

//     .toJSON() method

//     and many more (about 50+ Mongoose props)

// But your object has only content and timestamp, hence the error.


            await user.messages.push(newMessage as Message)
            // Since Message is used as a subdocument inside the User schema, you should not assign 
            // Message as a type manually. Let Mongoose handle it when you push it into the user’s
            //  messages array:
            await user.save()
             return Response.json(
                {success:true,
                message:"messg seent successfully"
                },{status:201})



      

        
    } catch (error) { 
        
        return Response.json(
                {success:false,
                message:"not able to send message"
                },{status:403})
        
    }}