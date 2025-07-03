'use client'
// {/* Server sees 'use client' - sends as JS to browser*/}

// ti underastand use client pls read claude-ai, next.js-5//

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
// this is the same session we tinkered with in callback//
import {User} from 'next-auth'
import { Button } from '@react-email/components'
import { useRouter } from 'next/navigation'
import { link } from 'fs'
// You're importing TypeScript's type definition of the built-in User object as defined by NextAuth.
// ✅ It's just a type, not a runtime object.
// This refers to the built-in NextAuth User type — which is a very minimal interface,
// This is used before the session and token callbacks run.


const Navbar = () => {
    // we will inject this navbar in layout, so that this appear on evry page//
  const { data: session } = useSession()
  const user = session?.user // Optional chaining for safety
  const router= useRouter()



  return (

//    The <nav> element tells browsers, screen readers, and search engines that the content
//     inside contains navigation links - making your HTML more meaningful and accessible.

  <nav className='p-4 md:p-6 shadow-md'>
    <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        {/* In React (JSX), sibling components are 
        any two or more elements placed side by side at the same level, not wrapped in a single parent. */}
        <a className="text-xl font-bold mb-4 md:mb-0 " href="#">Mystery message</a>
        {session?
        (<div><span className='mr-4'>Welcome {user?.username ||user?.email}😊
        </span>        
        <Button className='w-full md:w-auto hover:underline' onClick={()=>signOut()}>Logout</Button></div>   ):
        (<Link href={'/sign-in'}><Button className='w-full md:w-auto hover:underline'>Login</Button></Link>)}
    </div>
  </nav>
  )
} 

export default Navbar













// The syntax you're using is a ternary operator inside JSX — a very common pattern in React.
// 🔹 Full Syntax:

// {session ? (
//   <span>
//     Welcome, {user?.username || user?.email}
//   </span>
//   <button>hi</button>
// ) : (
//   // nothing or alternative content
// )}

// 🔍 Breakdown:

//     { ... } — tells JSX: "Evaluate this JavaScript inside"

//     session ? ( ... ) : ( ... ) — this is a ternary operator:

//         If session is truthy, it renders the first block

//         If session is falsy, it renders the second block (currently () means "render nothing")

// 🧠 But there's a problem:

// JSX can’t return two sibling elements side by side unless they’re wrapped.

// This is not valid:

// return (
//   <span>Hi</span>
//   <button>Click</button>  // ❌ Siblings not allowed directly
// )

// ✅ Fix: Wrap the elements inside a <div> or a React.Fragment

// Using div:

// {session ? (
//   <div>
//     <span>Welcome, {user?.username || user?.email}</span>
//     <button>hi</button>
//   </div>
// ) : null}

// Using Fragment:

// {session ? (
//   <>
//     <span>Welcome, {user?.username || user?.email}</span>
//     <button>hi</button>
//   </>
// ) : null}

// ✅ Summary:

//     The syntax is a ternary operator in JSX

//     You must wrap multiple JSX elements inside a single parent (like <div> or <>)

//     user?.username || user?.email means: show username, and if not found, show email

// Let me know if you want it refactored into a cleaner reusable block.
