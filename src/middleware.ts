// middleware.ts
import { NextRequest,NextResponse } from "next/server";
// import type { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url=  request.nextUrl;



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
    //this won't work until we made frontned pagw for dashbaord to let middleware work//
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in','/sign-up','/','/dasboard/:path*','/verify/:path*']
};
