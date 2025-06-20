import 'next-auth'
import { JWT } from "next-auth/jwt";
import { boolean } from 'zod/v4';
import { DefaultSession } from 'next-auth';
declare module 'next-auth'{
    interface User{
    //   ✅ You're telling TypeScript:

    // "Hey, the default User interface from NextAuth now includes these extra properties."
         _id?: string; // or Types.ObjectId
    username?: string;
    isVerified?:boolean;
    isAcceptingMessages?:boolean;


    }
    // interface JWT{
    //        _id?: string;
    // username?: string;
    // email?: string;
    // }
    
    interface Session{
//       ✅ You’re extending the default user object in the session, keeping NextAuth’s fields (name, email, image) AND adding your own (_id, username, etc.).

// ❌ You are not replacing the whole thing, which is a common mistake.
        user: User & DefaultSession["user"];//==>>This is a TypeScript utility trick. It means:

    // "Take the default user shape that NextAuth provides, and merge it with my custom User fields."
    }
    //     user: {
    // _id?: string; // or Types.ObjectId or //user:User;
    // // But:

    // // That will completely replace the built-in Session.user type (which includes optional fields like name, email, and image).

    // // If you want to extend it rather than replace it, you should do:
    // username?: string;
    // isVerified?:boolean;
    // isAcceptingMessages?:boolean;}&
    // DefaultSession['user']}
}



declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string|null;
    isVerified?:boolean;
    isAcceptingMessages?:boolean;
   
  }
}













/* import 'next-auth'

declare module 'next-auth'{
    interface User{
        _id?:string;
    }
} why creating new file in tyoe remove that error , what are we doing here ??
ChatGPT said:

Excellent question — you're stepping into TypeScript module augmentation, a powerful but often misunderstood feature. Let’s break this down:
🔍 What You're Doing

When you write:

import 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string;
  }
}

You are not creating a new type.
You are extending (augmenting) an existing type declared inside the next-auth package — specifically its User interface.
🔧 Why You Need This

NextAuth provides its own default User type:

// next-auth types (simplified)
interface User {
  name?: string;
  email?: string;
  image?: string;
}

But your user object (coming from MongoDB) includes extra properties like _id or username, which TypeScript doesn’t know about by default.

So if you try this in your jwt() or session() callback:

token._id = user._id; // ❌ TS error: '_id' does not exist on type User

    🔴 Because TypeScript is using the original User interface from next-auth, which doesn't have _id.

✅ What Module Augmentation Does

With this code:

declare module 'next-auth' {
  interface User {
    _id?: string;
  }
}

You are telling TypeScript:

    “Hey, extend the built-in User interface from NextAuth to include an optional _id field.”

Now TypeScript knows:

user._id // ✅ No error

🧠 Why in a separate file?

Because:

    TypeScript only applies module augmentation globally if it's in a .d.ts file or imported in the right place.

    You usually put this in a custom type definition file like:

/types/next-auth.d.ts

And in your tsconfig.json, make sure TypeScript includes this file:

{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}

Or just import it once in your app (e.g., app/layout.tsx) so it’s part of the global type scope.
✅ Example Full Flow:
1. Create /types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface User {
    _id?: string;
    username?: string;
    // add anything else you return from authorize()
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
    }
  }
}

2. Add it to global types (by importing somewhere or using typeRoots)

Now you can safely write:

token._id = user._id;
session.user._id = token._id;

✅ No TypeScript errors
✅ Full autocomplete support
🔁 Summary
Concept	What It Does
declare module	Re-opens and extends a module's types
Why separate file?	So TypeScript sees it globally
Fixes what?	TS errors like _id not on User
When needed?	When you're adding custom props to user or session

Let me know if you'd like me to generate the full example boilerplate or a diagram showing how types flow from authorize() → jwt() → session()!
*/