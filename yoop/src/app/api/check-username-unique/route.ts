import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../model/user.model";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";




// Now you're creating an object schema that uses it:
const usernameQuerySchema = z.object({
    username: usernameValidation, // Reusing the validation rules
    // "Create an object schema where the username field should follow the usernameValidation rules."

})


export async function GET(request:Request){
    // if(request.method!=="GET"){
    //      return Response.json({
    //             // This is a Next.js helper method available in the App Router (app/) that simplifies returning JSON responses.
    //             success:false,
    //             message:"only get request are allowed"
    //         },{status:500})

    //     }
    
    await dbConnect()
    console.log("database connected")
    try {
        // const url = new URL(request.url)
        const {searchParams} = new URL(request.url)
        
        console.log("this is the request url",request.url)
        // searchParams.get("username");
        // A string representing the value of the specified query parameter.
        //but we have definex zod schema for username as object so//
        const queryParam={
            username: searchParams.get("username")
        }
        console.log(queryParam.username)
        //vallidating the object we have made//
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log("this is the reuslt we got after zod validation",result)
        if (!result.success){
            const usernameErros= result.error.format().username?._errors || []
            return Response.json({
                // This is a Next.js helper method available in the App Router (app/) that simplifies returning JSON responses.
                success:false,
                message:usernameErros?.length>0?usernameErros.join(','):'Invalid query paramters'
            },{status:400})
        }
        const {username} = result.data
        //now verify whether username exists in databse while user siging-up//
        const existingVerifiedUser = await UserModel.findOne(
            {username, isVerified:true}
        )
        if(existingVerifiedUser){
                 return Response.json({
                // This is a Next.js helper method available in the App Router (app/) that simplifies returning JSON responses.
                success:false,
                message:"username is already taken"
            },{status:400})

        }
        else{
            console.log("after due diligence this is what we got")
        return Response.json({
                // This is a Next.js helper method available in the App Router (app/) that simplifies returning JSON responses.
                success:true,
                message:"username is available"
            },{status:200})
        }

        
    } catch (error) {
        console.log(error,"!!!!!!")
        return Response.json({
            success:false,
            message:"Error checking username"
        }, { status: 500 })
        throw error
        
    }
}




// // ✅ Valid username
// const result1 = usernameValidation.safeParse("john_doe123");
// console.log(result1);
// // Output: { success: true, data: "john_doe123" }

// // ❌ Invalid username (too long)
// const result2 = usernameValidation.safeParse("this_username_is_way_too_long");
// console.log(result2);
// // Output: { 
// //   success: false, 
// //   error: { issues: [{ message: "Username must be at most 20 characters long" }] }
// // }

// // ❌ Invalid username (special characters)
// const result3 = usernameValidation.safeParse("john@doe");
// console.log(result3);
// // Output: { 
// //   success: false, 
// //   error: { issues: [{ message: "Username can only contain letters, numbers, and underscores" }] }
// // }


