// middleware.ts
import { NextRequest,NextResponse } from "next/server";
// NextRequest gives you details of the incoming request (URL, headers, etc).

// NextResponse lets you redirect or allow the request.
// import type { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// we can also auth function and import it, instead of getToken//
// getToken() reads and verifies the JWT token stored in cookies (via NextAuth).




export async function middleware(request: NextRequest) {
//   token will be null if the user is not logged in.

// If logged in, token contains fields like _id, username, email, etc.
  const token = await getToken({ req: request });
  const url=  request.nextUrl;
  
// console.log("Verified JWT payload:", token);
// Safe and returns full token: { _id, username, email, etc. }



  if (token &&
    (
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign-up')||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/'))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if(!token &&url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL ('/sign-in', request.url))
    //     If the user is not logged in, and tries to go to /dashboard, redirect to /sign-in.

    // ✅ This protects the dashboard from unauthorized access.


    //this won't work until we made frontned pagw for dashbaord to let middleware work//
  }

  return NextResponse.next();
  //  It is a response object used to send a response, redirect, or continue the request.
  // This means "allow the request to proceed."
}

export const config = {
  matcher: ['/sign-in','/sign-up','/','/dasboard/:path*','/verify/:path*']
};




// yes and there is  folder named context and what is the use of that folder ??
// ChatGPT said:

// Great — let's address both your questions step-by-step:
// ✅ 1. Quick Code Comparison: request.cookies vs getToken
// ❌ Using request.cookies manually:

// // Not secure or recommended
// const raw = request.cookies.get("next-auth.session-token")?.value;

// console.log("Raw cookie value:", raw); // this is a raw JWT token (string)

// const decoded = JSON.parse(atob(raw.split('.')[1])); // decode payload (not safe!)
// console.log("Decoded token:", decoded);

//     🔴 Doesn’t verify the JWT signature — someone could fake the token

//     🔴 atob() only base64-decodes — not secure or recommended

//     🔴 Breaks if you use __Secure- cookies (used in production)

// ✅ Using getToken({ req }) from next-auth/jwt:

// import { getToken } from "next-auth/jwt";

// const token = await getToken({ req: request });

// console.log("Verified JWT payload:", token);
// // Safe and returns full token: { _id, username, email, etc. }

//     ✅ Automatically looks for the correct cookie (next-auth.session-token)

//     ✅ Verifies the signature

//     ✅ Returns a fully decoded, safe object









// so name of function middleware is neccessary and isnide it is what we want to do when sokmeone visits route listed in matcher we have also exporte3d ??
// ChatGPT said:

// Yes — you're understanding it correctly! Here's a clean explanation:
// ✅ Is the function name middleware necessary?

// Yes. In Next.js (App Router), the file must export a function named middleware like this:

// export async function middleware(request: NextRequest) {
//   // your logic here
// }

//     🔴 If you use any other name, Next.js won't recognize it as middleware.

// ✅ What does the middleware() function do?

// It runs before any request reaches your actual route.

// Think of it like a security guard:

//     "Should I let you into /dashboard?"

//     "Should I redirect you to /sign-in?"

//     "You're already signed in, so don't go back to /sign-in again."

// Inside it, you can:

//     Read the request (request.url, request.cookies, etc.)

//     Check authentication status using getToken()

//     Redirect, block, or allow the request

// ✅ Why do we export config?

// The config.matcher tells Next.js which routes should trigger the middleware.

// export const config = {
//   matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"]
// }

// It works like a filter:

//     Only the paths in matcher will pass through middleware()

//     Others will bypass it

// 🔁 Summary
// Part	Purpose
// export function middleware()	The main logic that runs before matched routes
// export const config.matcher = [...]	List of routes that should use this middleware
// Why name must be middleware?	That's how Next.js identifies the special function
// Can you rename it?	❌ No. It must be middleware exactly

// Would you like a diagram of how middleware flows from route visit → middleware → redirect/continue?
