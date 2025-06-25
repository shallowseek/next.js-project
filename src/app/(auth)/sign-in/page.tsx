'use client'
import { useSession, signIn, signOut } from "next-auth/react"
// 1. User visits: /sign-in
//    ↓ Next.js App Router handles this
// 2. Your React component renders
//    ↓ User clicks "Sign in" button  
// 3. signIn() function calls: /api/auth/signin
//    ↓ Auth.js handlers handle this API call
// 4. Auth.js processes authentication
//    ↓ Success/failure response
// 5. Your React component updates based on session
// /sign-in = Your frontend page (React component)
// /api/auth/signin = Auth.js backend API (authentication processing)

// So Next.js App Router handles the GET request to /sign-in by rendering your 
// React component, while Auth.js only handles requests to /api/auth/* routes!



export default function Component() {
  const { data: session } = useSession()
  //useSession() returns an object like this//
//   {
//   data: Session | null,
//   status: "authenticated" | "unauthenticated" | "loading"
// }
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500" onClick={() => signIn()}>Sign in</button>
    </>
  )
}





// Ah, excellent catch! You're absolutely right. Let me clarify what happens with your configuration:

// ## Your Configuration:
// ```typescript
// pages: {
//   signIn: '/sign-in' // This tells Auth.js where YOUR custom page is
// }
// ```

// ## What happens when you call `signIn()`:

// ### Scenario 1: `signIn()` with no parameters
// ```typescript
// // In your component:
// <button onClick={() => signIn()}>Sign in</button>
// ```

// **Flow:**
// 1. `signIn()` is called
// 2. Auth.js sees you have `pages.signIn: '/sign-in'` configured
// 3. **Auth.js redirects browser to `/sign-in`** (your custom page)
// 4. Your React component renders
// 5. User sees your custom signin form

// ### Scenario 2: `signIn()` with credentials
// ```typescript
// // If you had a form with actual credentials:
// signIn('credentials', {
//   email: 'user@example.com', 
//   password: 'password123'
// })
// ```

// **Flow:**
// 1. `signIn()` makes **POST request to `/api/auth/signin/credentials`**
// 2. Your Auth.js handler processes the credentials
// 3. Your `authorize()` function validates the user
// 4. Auth.js creates session and redirects

// ## The Key Point:

// ```typescript
// pages: {
//   signIn: '/sign-in'
// }
// ```

// This tells Auth.js: **"Don't show your default signin form, redirect users to MY custom page instead"**

// ## What your current setup does:

// ```
// 1. User clicks signIn() → Auth.js redirects to /sign-in
// 2. /sign-in shows your React component  
// 3. User clicks signIn() again → Still redirects to /sign-in
// 4. Infinite loop of showing the same page!
// ```

// ## To fix this, you'd typically have:

// ```typescript
// // A proper signin form in your custom page:
// export default function SignInPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
  
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     // This actually submits credentials
//     const result = await signIn('credentials', {
//       email,
//       password,
//       redirect: false
//     })
//   }
  
//   return (
//     <form onSubmit={handleSubmit}>
//       <input value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button type="submit">Sign In</button>
//     </form>
//   )
// }
// ```

// So `signIn()` **redirects to your page**, it doesn't call the API directly unless you provide credentials!