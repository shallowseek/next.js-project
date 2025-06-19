// This file contains your Auth.js configuration object. It defines:

// Which authentication providers to use (Google, GitHub, etc.)
// Database configuration
// Session settings
// Callbacks and custom logic
// JWT settings
// Example options.ts structure
// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     })
//   ],
//   // other configuration...
// }


// we are going for credentialas provider

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"// to verify the password he will provide//
import dbConnect from "@/lib/dbConnect"// to establsih connection to database
import UserModel from "@/models/user.model"// to verify that signing user is even registered in databse//


export const authOptions=NextAuth({
//     The NextAuthOptions interface includes properties like:

// providers - authentication providers (Google, GitHub, etc.)
// callbacks - custom callback functions
// pages - custom page routes
// session - session configuration
// jwt - JWT configuration
// And many others.

  providers: [
    Credentials({// Credentials is a method
      credentials: {
        // The lowercase credentials is a property/field definition object that tells
        //  Auth.js what input fields to show on the login form and how to handle them.
        email: { label: "Email", type:"email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async function(credentials:any, request:any):Promise<any> {
        // It's a callback function that handles the actual authentication logic for credential-based login.
        await dbConnect()
        try {
            const user = await UserModel.findOne({
                $or:[
                    {email:credentials.email},
                    {username:credentials.username}
                ]
            })
            if(!user){
                throw new Error("no username/email found")
            }
            //now we will check if user is registered but not verified
            if(!user.isVerified){
                throw new Error("not verified, please verify your account")
            }
            //now if user is found , we will validate password
            const password = user.password// will return encrypted password
            const result = bcrypt.compare(credentials.password, password)
            if(!result){
                throw new Error("wrong password, pls try again")
            }
            return user
        } 
        
        catch (error:any) {
            console.log("failed to connect to database", error.message)
            throw new Error(error.message || error.toString() || "Unknown error")
        }
        // const response = await fetch(request)
        // if (!response.ok) return null
        // return (await response.json()) ?? null
      }
    }),
  ],
}
)




// You're absolutely right to be confused! Let me clarify what's happening here.

// ## Valid ways to define functions as object values:

// ```javascript
// // Method 1: Function expression (what you should use)
// const obj = {
//   authorize: async function(credentials, request) {
//     // function body
//   }
// }

// // Method 2: Arrow function (also correct)
// const obj = {
//   authorize: async (credentials, request) => {
//     // function body
//   }
// }

// // Method 3: Method shorthand (ES6)
// const obj = {
//   async authorize(credentials, request) {
//     // function body
//   }
// }
// ```

// ## What you wrote (incorrect):
// ```javascript
// const obj = {
//   authorize: async authorize(credentials, request) {
//     //              ^^^^^^^^^ This is the problem
//   }
// }
// ```

// ## The issue:
// When you write `async authorize(credentials, request)`, you're trying to declare a **named function** called `authorize`. But you're already using `authorize` as the **property key**.

// This creates a syntax error because:
// - `authorize:` says "this property is called authorize"
// - `async authorize(...)` says "this function is called authorize" 
// - JavaScript gets confused by the duplicate naming

// ## Think of it like this:
// ```javascript
// // This is like saying "the key 'name' has a value called 'name'"
// const person = {
//   name: function name() { return "John" } // Confusing but technically valid
// }

// // Much clearer:
// const person = {
//   name: function() { return "John" }  // Anonymous function
//   // OR
//   name() { return "John" }            // Method shorthand
// }
// ```

// So yes, you can absolutely set functions as values of object keys - you just need to use the correct syntax!