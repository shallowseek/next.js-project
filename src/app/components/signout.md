`signOut()` is the NextAuth.js function that **logs out the current user** and cleans up their authentication session. It's the counterpart to `signIn()`.

## Import and Basic Usage:

```javascript
import { signOut } from "next-auth/react"

// Simple sign out
await signOut()

// With options
await signOut({ 
  callbackUrl: "/login",
  redirect: true 
})
```

## What signOut() does:

### 1. **Clears the session**
- Removes the session token from cookies
- Invalidates the JWT token
- Clears session data from browser storage

### 2. **Database cleanup** (if using database sessions)
- Deletes the session record from your database
- Removes associated session tokens

### 3. **Redirects the user** (by default)
- Redirects to the sign-in page or specified URL
- Can be disabled with `redirect: false`

## signOut() Options:

```javascript
await signOut({
  callbackUrl: "/goodbye",    // Where to redirect after sign out
  redirect: true              // Whether to redirect (default: true)
})
```

## Usage Examples:

### **Simple logout button:**
```javascript
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
```

### **Custom redirect after logout:**
```javascript
const handleLogout = async () => {
  await signOut({ 
    callbackUrl: "/login?message=logged-out" 
  })
}
```

### **Sign out without redirect:**
```javascript
const handleLogout = async () => {
  await signOut({ redirect: false })
  // Do custom logic after logout
  router.push("/custom-goodbye-page")
}
```

### **Server-side sign out** (API routes):
```javascript
// In an API route
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (session) {
    // Clear session server-side
    res.setHeader('Set-Cookie', [
      'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
    ])
  }
  
  res.redirect(302, '/login')
}
```

## Comparison with signIn():

| Function | Purpose | What it does |
|----------|---------|-------------|
| `signIn()` | **Log in** user | Creates session, sets cookies, redirects to app |
| `signOut()` | **Log out** user | Destroys session, clears cookies, redirects to login |

## Return value:
`signOut()` returns a Promise that resolves when the logout process is complete. If `redirect: false`, you can wait for it to complete before doing custom logic.

The key difference is that while `signIn()` **creates** authentication state, `signOut()` **destroys** it and cleans up all traces of the user's session.