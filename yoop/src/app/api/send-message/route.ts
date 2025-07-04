import getServerSession  from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "../../../model/user.model"
import { Message } from "../../../model/user.model";
import dbConnect from "@/lib/dbConnect"
import { User, Session } from "next-auth"
import { timeStamp } from "console";

//ones which we have defined//


export async function POST(request:Request){
   //to register send message into databse and it is not necessary that user mustv be logged in//

    await dbConnect()


    const{id, content}= await request.json();
    console.log("this is the id of user",id)
    try {
        //first we will find user in databse//
        const user = await UserModel.findOne({_id:id});
        //if no user//
        if(!user){
            return Response.json(
                {success:false,
                message:"user is not registered"
                },{status:401})
        }
        // check if user is accepting messages//
        console.log("this is to see whther user is accepting message",user.isAcceptedMessage)
        console.log("Full user object:", user.toObject());
        if(user.isAcceptedMessage !== true){
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


          const newUser =  await UserModel.findByIdAndUpdate(
                                id,
                                { $push: { messages: newMessage } },
                                { new: true }
                                )
            //push return old document is new:true is not set//
            // Since Message is used as a subdocument inside the User schema, you should not assign 
            // Message as a type manually. Let Mongoose handle it when you push it into the user’s
            //  messages array:
            // await newUser?.save()
             return Response.json(
                {success:true,
                message:"messg seent successfully"
                },{status:200})



      

        
    } catch (error) { 
        
        return Response.json(
                {success:false,
                message:"not able to send message"
                },{status:403})
        
    }}