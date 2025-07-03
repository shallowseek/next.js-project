'use client'
import { SessionProvider } from "next-auth/react"
import React from "react"

export default function AuthProvider({
  children,

}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
      {/* SessionProvider creates a "global bucket" of auth/session data.

Any child component nested under it can pull from that bucket using useSession(). */}
   {children}
    </SessionProvider>
  )
}