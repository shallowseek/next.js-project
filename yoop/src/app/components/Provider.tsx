"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// This component wraps your app in NextAuth session context
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
// You installed a compatible version of next-auth that works with your Next.js version.

// You renamed next.config.js to next.config.cjs because your project uses "type": "module" in package.json, and .js files are treated as ES Modules (which don’t support module.exports).

// Your npm run dev command now runs successfully without crashing.