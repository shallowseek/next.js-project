import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import {z} from "zod"
import { verifySchema } from "@/schemas/verifySchema";


// we will get api request from frontend to verify whther user has put correct code//
export async function POST(request:Request){
    await dbConnect()
    try {
        // i am assuming user will send code in body in json format from frontend//
        // You're close — but in Next.js (App Router) with fetch-based handlers (like in app/api/.../route.ts), the request body
        //  doesn't come directly as request.body. You must parse it first because it's a readable stream.
       const {username,code} = await request.json(); // Parse body as JSON
    //    const decodedUsername = decodeURIComponent(username)

        console.log("Received code:", code);
//         const userAgent = request.headers.get("user-agent"); // separate
//   const method = request.method;                      // separate
//   const { searchParams } = new URL(request.url);      // separate
//   const token = request.cookies.get("token");         // separate (Next.js only)


//zod verification before dtabae validation//
const obj =  {code}
const result =  verifySchema.safeParse(obj)
if(!result){
    // const codeError = result.error.format().code?._errors || []
    // return Response.json({
    //         success:false,
    //         message:codeError?.length>0?codeError.join(','):'Invalid query paramters'
    //     }, { status: 400 })
      return Response.json({
            success:false,
            message:"Verify code is not in correct format"
        }, { status: 400 })

}

  //now check in database//
const user = await UserModel.findOne({username})
if(!user){
     return Response.json({
            success:false,
            message:"User not found"
        }, { status: 400 })

}
// now match code //
// if(user.verifyCode===code){
//     // we have to check what data typw we have dscribed for verifycode sunce .json returns string//
//     user.isVerified = true;
//     await user.save();
// }
const isCodevalid= user?.verifyCode===code;
const isCodeNotExpired =  new Date(user.verifyCodeExpires) > new Date()

if(isCodeNotExpired && isCodevalid){
    user.isVerified=true;
    await user.save()
     return Response.json({
            success:true,
            message:"Verify code matched"
        }, { status: 200 })
}
else if(!isCodeNotExpired){
     return Response.json({
            success:false,
            message:"Verify code has expired, pls sign-up again to get a new code"
        }, { status: 500 })
}
 return Response.json({
            success:false,
            message:"Verify code does not match"
        }, { status: 500 })


        
    } catch (error) {
          console.log(error,"verify code does not match")
        return Response.json({
            success:false,
            message:"Error verifying user"
        }, { status: 500 })
        
    }
}
