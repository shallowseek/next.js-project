// // middleware.ts
// import { NextRequest,NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });

//   if (!token) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/sign-in','/sign-up','/','/dasboard/:path*','/verify/:path*']
// };
