import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptedMessage?: boolean;
    email: string;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptedMessage?: boolean;
      email?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptedMessage?: boolean;
    email?: string | null;
  }
}
