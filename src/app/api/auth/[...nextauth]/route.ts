//  This is the actual API route handler for the App Router. It imports the options and creates the NextAuth handler:
//  // Example route.ts
// import NextAuth from 'next-auth'
// import { authOptions } from './options'

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



