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

import type { NextAuthOptions } from "next-auth"


import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"// to verify the password he will provide//
import dbConnect from "@/lib/dbConnect"// to establsih connection to database
import UserModel from "../../../../model/user.model"// to verify that signing user is even registered in databse//
// import { MongoDBAdapter } from "@auth/mongodb-adapter";


export const authOptions: NextAuthOptions = {
//     The NextAuthOptions interface includes properties like:

// providers - authentication providers (Google, GitHub, etc.)
// callbacks - custom callback functions
// pages - custom page routes
// session - session configuration
// jwt - JWT configuration
// And many others.

  providers: [
    CredentialsProvider({// Credentials is a method
         // This name appears on the sign in form button (e.g. "Sign in with credentials")
      name: "credentials",
      id: "credentials",
      credentials: {
        // The lowercase credentials is a property/field definition object that tells
        //  Auth.js what input fields to show on the login form and how to handle them.
        email: { label: "Email", type:"email" },
        password: { label: "Password", type: "password" },
      },
            // This function is called when user submits the sign-in form
      // It receives the credentials from the form submission
      // authorize: async function(credentials:any, request:any):Promise<any> {
        async authorize(credentials:any, request:any):Promise<any>{ 
           console.log("🧠 AUTHORIZE CALLED with credentials:", credentials); // <- Put this here first!
        // It's a callback function that handles the actual authentication logic for credential-based login.
        await dbConnect()
        console.log("database started")
        try {
            const user = await UserModel.findOne({
                $or:[
                    {email:credentials.email},
                    // {username:credentials.username}
                ]
            })
            if(!user){
                // throw new Error("no username/email found")
                return null
            }
            //now we will check if user is registered but not verified
            if(!user.isVerified){
                // throw new Error("not verified, please verify your account")
                return null
            }
            //now if user is found , we will validate password
            const password = user.password// will return encrypted password
            const result = await bcrypt.compare(credentials.password, password)
            if(!result){
                // throw new Error("wrong password, pls try again")throw new Error("Invalid credentials")  // ❌ this triggers redirect to `/api/auth/error`
                 return null; // ✅ this tells NextAuth to return error in result, not redirect
            }
            console.log("🔍 Authorize function called with:", {
          username: credentials?.email,
          password: credentials?.password,
          requestMethod: request.method, // This will be POST
          requestUrl: request.url
        })
         // Return user object (this will be stored in the JWT/session)
          // Don't include sensitive data like password
           return {
  _id: user._id.toString(),
  username: user.username,
  email: user.email,
  isVerified: user.isVerified,

  isAcceptedMessage: user.isAcceptedMessage, // ✅ correct key spelling
};
}
    
    catch (error:any) {
          console.log("failed to connect to database", error.message)
    // ✅ Return null instead of throwing error
    return null; // This will give you result.error = "CredentialsSignin"
    }
    // const response = await fetch(request)
    // if (!response.ok) return null
    // return (await response.json()) ?? null
  }}
),
  ],
  // To enable custom pages add the following to your Auth.js configuration. 
  // In the pages object, the key is the type of page and the value is the path/route at which the 
  // page is located. Please make sure you actually have a page at the specified route.
  pages:{
    signIn:'/sign-in',
    error: "/sign-in"    // redirect back to login on error
    // "Hey Auth.js, when someone calls signIn(), 
     //  send them to MY page, not your default form"

//      /api/auth/signin ✅ Exists (Auth.js default form)
// /api/sign-in ❌ Does NOT exist in your code
// /sign-in ✅ Exists (your custom page)
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.AUTH_SECRET,
  
  
  // These are just functions that 
  //   NextAuth calls for you at specific moments — and you write what you want them to do.
  callbacks:{
      async jwt({ token, user }) {
//        The user object is whatever you returned from authorize().

// TypeScript only thinks it’s an object of type User (from next-auth interface).

// But JavaScript doesn't care about TypeScript — so at runtime, it uses the actual values you returned.
    if (user) {
      token._id = user._id?.toString();//so that it gets converted into string from object//
      // “If user is not null or undefined, then access _id”
      token.username = user.username;
      token.isVerified = user.isVerified;
      token.email=user.email;
        token.isAcceptedMessage = user.isAcceptedMessage; // ✅ fix spelling

      //never send passord or sensistive data
    }
    return token;
  },
  async session({ session, token }) {
    if(token){
      session.user._id=token._id;
      // TypeScript never prevents your object from having a property. 
      // It only complains when you access a property that it doesn't know about.
      session.user.isVerified = token.isVerified;
      session.user.isAcceptedMessage = token.isAcceptedMessage; // ✅
      session.user.username=token.username;
      // session.user.email=token.email;

    }
   
    return session;
  },
    

  },
  debug: true, // logs all NextAuth internals to terminal
}





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