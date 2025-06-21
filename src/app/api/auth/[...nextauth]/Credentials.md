###
#
###
The uppercase `Credentials` is an **Auth.js provider function** that you import from the NextAuth library. It's one of the built-in authentication provider types.

## Import Statement
```typescript
import Credentials from "next-auth/providers/credentials"
// or
import { Credentials } from "next-auth/providers/credentials"
```

## What it is:
**`Credentials`** is a factory function that creates a credentials-based authentication provider. When you call it, it returns a provider configuration object that Auth.js can use.

## The Pattern:
```typescript
providers: [
  Credentials({  // ← This is the imported function
    // Configuration object passed to the function
    credentials: { /* form fields */ },
    authorize: async (credentials) => { /* your logic */ }
  })
]
```

## Other Provider Functions:
Auth.js has many similar provider functions:
```typescript
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github" 
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

providers: [
  Google({ clientId: "...", clientSecret: "..." }),    // Function call
  GitHub({ clientId: "...", clientSecret: "..." }),    // Function call  
  Credentials({ credentials: {...}, authorize: {...} }) // Function call
]
```

## Why it's uppercase:
It follows JavaScript naming conventions where:
- **Functions/constructors** start with uppercase (like `Credentials`, `Google`)
- **Properties/variables** start with lowercase (like `credentials`, `clientId`)

So `Credentials` is the provider constructor function, while `credentials` is a property you pass into that function to define your form fields.












###
#
###
