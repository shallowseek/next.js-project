###
/*
COMPLETE GUIDE TO AUTH.JS (NextAuth.js) ROUTES
===============================================
Auth.js exposes a REST API with multiple endpoints for authentication.
All routes are prefixed with /api/auth by default.
*/

// CONFIGURATION SETUP
// pages/api/auth/[...nextauth].js (Pages Router)
// OR app/api/auth/[...nextauth]/route.js (App Router)

import NextAuth from 'next-auth'

export default NextAuth({
  // Your NextAuth configuration
  providers: [/* your providers */],
  // Other options...
})

/*
ALL AVAILABLE AUTH.JS ROUTES:
============================
Base path: /api/auth (configurable via NEXTAUTH_URL)
*/

// 1. SIGN-IN ROUTES
// =================

// GET /api/auth/signin
// - Displays the built-in sign-in page
// - Shows all configured providers
// - Automatically generated by NextAuth
fetch('/api/auth/signin')
  .then(response => response.text()) // Returns HTML page
  .then(html => console.log(html))

// POST /api/auth/signin/:provider
// - Starts provider-specific sign-in flow
// - Requires CSRF token from /api/auth/csrf
// - Used internally by signIn() method

// Examples:
// POST /api/auth/signin/credentials - For credentials provider
// POST /api/auth/signin/google - For Google OAuth
// POST /api/auth/signin/github - For GitHub OAuth

const csrfToken = await fetch('/api/auth/csrf').then(res => res.json())

// Manual POST to credentials provider
fetch('/api/auth/signin/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    username: 'john',
    password: 'password123',
    csrfToken: csrfToken.csrfToken
  })
})

// 2. CALLBACK ROUTES
// ==================

// GET/POST /api/auth/callback/:provider
// - Handles returning requests from OAuth services
// - Processes OAuth authorization codes
// - Validates state parameter for security
// - Called automatically by OAuth providers

// Examples:
// GET /api/auth/callback/google - Google OAuth callback
// GET /api/auth/callback/github - GitHub OAuth callback
// POST /api/auth/callback/credentials - Credentials callback

// You don't usually call these manually - OAuth providers redirect here

// 3. SIGN-OUT ROUTES
// ==================

// GET /api/auth/signout
// - Displays the built-in sign-out confirmation page
// - Shows current user info
fetch('/api/auth/signout')
  .then(response => response.text()) // Returns HTML page
  .then(html => console.log(html))

// POST /api/auth/signout
// - Actually signs the user out
// - Invalidates session/removes cookies
// - Requires CSRF token
// - Used internally by signOut() method

const signOutUser = async () => {
  const csrf = await fetch('/api/auth/csrf').then(res => res.json())
  
  await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      csrfToken: csrf.csrfToken
    })
  })
}

// 4. SESSION ROUTE
// ================

// GET /api/auth/session
// - Returns current session object
// - Client-safe (no sensitive data)
// - Returns empty object if no session
// - Contents configurable with session callback

const getSession = async () => {
  const session = await fetch('/api/auth/session').then(res => res.json())
  console.log(session)
  /*
  Response format:
  {
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/avatar.jpg"
    },
    expires: "2024-01-01T00:00:00.000Z"
  }
  
  OR {} if no session
  */
}

// 5. CSRF TOKEN ROUTE
// ===================

// GET /api/auth/csrf
// - Returns CSRF token for form submissions
// - Required for all POST requests to auth endpoints
// - Uses "double submit cookie method"
// - Signed HttpOnly cookie

const getCsrfToken = async () => {
  const response = await fetch('/api/auth/csrf')
  const data = await response.json()
  console.log(data)
  /*
  Response format:
  {
    csrfToken: "some-long-random-token-string"
  }
  */
}

// 6. PROVIDERS ROUTE
// ==================

// GET /api/auth/providers
// - Returns list of configured OAuth providers
// - Shows provider details (URLs, names, etc.)
// - Useful for building custom sign-in pages

const getProviders = async () => {
  const providers = await fetch('/api/auth/providers').then(res => res.json())
  console.log(providers)
  /*
  Response format:
  {
    "google": {
      "id": "google",
      "name": "Google",
      "type": "oauth",
      "signinUrl": "/api/auth/signin/google",
      "callbackUrl": "/api/auth/callback/google"
    },
    "credentials": {
      "id": "credentials", 
      "name": "credentials",
      "type": "credentials",
      "signinUrl": "/api/auth/signin/credentials",
      "callbackUrl": "/api/auth/callback/credentials"
    }
  }
  */
}

/*
PRACTICAL EXAMPLES USING THE ROUTES:
====================================
*/

// Example 1: Custom Sign-In Form
const CustomSignInForm = () => {
  const [csrfToken, setCsrfToken] = useState('')
  const [providers, setProviders] = useState({})
  
  useEffect(() => {
    // Get CSRF token
    fetch('/api/auth/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
    
    // Get available providers
    fetch('/api/auth/providers')
      .then(res => res.json())
      .then(setProviders)
  }, [])
  
  const handleCredentialsSignIn = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const response = await fetch('/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: formData.get('username'),
        password: formData.get('password'),
        csrfToken: csrfToken
      })
    })
    
    if (response.ok) {
      window.location.href = '/'
    }
  }
  
  return (
    <div>
      <form onSubmit={handleCredentialsSignIn}>
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      
      {Object.values(providers)
        .filter(provider => provider.id !== 'credentials')
        .map(provider => (
          <a key={provider.id} href={provider.signinUrl}>
            Sign in with {provider.name}
          </a>
        ))
      }
    </div>
  )
}

// Example 2: Session Checker
const SessionChecker = () => {
  const [session, setSession] = useState(null)
  
  const checkSession = async () => {
    const sessionData = await fetch('/api/auth/session').then(res => res.json())
    setSession(sessionData)
  }
  
  useEffect(() => {
    checkSession()
    
    // Poll session every 30 seconds
    const interval = setInterval(checkSession, 30000)
    return () => clearInterval(interval)
  }, [])
  
  if (session?.user) {
    return <div>Signed in as {session.user.email}</div>
  }
  
  return <div>Not signed in</div>
}

// Example 3: Custom Sign-Out Button
const CustomSignOutButton = () => {
  const handleSignOut = async () => {
    const csrf = await fetch('/api/auth/csrf').then(res => res.json())
    
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken: csrf.csrfToken
      })
    })
    
    window.location.href = '/'
  }
  
  return <button onClick={handleSignOut}>Sign Out</button>
}

/*
ROUTE CUSTOMIZATION:
===================
*/

// Custom base path (via environment variable)
// NEXTAUTH_URL=https://example.com/myapp/api/authentication

// This changes all routes:
// /api/auth/signin -> /myapp/api/authentication/signin
// /api/auth/session -> /myapp/api/authentication/session
// etc.

/*
ROUTE SECURITY:
==============
*/

// 1. CSRF Protection
// - All POST routes require CSRF token
// - Get token from /api/auth/csrf
// - Include in all form submissions

// 2. State Parameter (OAuth)
// - OAuth routes use state parameter for security
// - Prevents CSRF attacks on OAuth callbacks
// - Automatically handled by NextAuth

// 3. HttpOnly Cookies
// - Session cookies are HttpOnly (not accessible via JavaScript)
// - Prevents XSS attacks

/*
IMPORTANT NOTES:
===============
*/

// 1. Most of the time, use NextAuth client methods instead of direct API calls:
import { signIn, signOut, useSession } from 'next-auth/react'

// Instead of manual API calls, use:
signIn('credentials', { username, password })
signOut()
const { data: session } = useSession()

// 2. Direct API calls are useful for:
// - Custom implementations
// - Server-side operations
// - Building custom UI components
// - Integration with other systems

// 3. All routes respect your NextAuth configuration:
// - Callbacks are applied
// - Custom pages are used
// - Database operations are performed
// - JWT/database sessions are handled

/*
SUMMARY OF ALL ROUTES:
=====================
GET  /api/auth/signin                    - Show sign-in page
POST /api/auth/signin/:provider          - Start sign-in flow
GET  /api/auth/callback/:provider        - OAuth callback (GET)
POST /api/auth/callback/:provider        - OAuth callback (POST)
GET  /api/auth/signout                   - Show sign-out page
POST /api/auth/signout                   - Sign out user
GET  /api/auth/session                   - Get current session
GET  /api/auth/csrf                      - Get CSRF token
GET  /api/auth/providers                 - Get configured providers
*/

























###
##
#####
/*
NEXTAUTH SIGN-UP PATTERNS
=========================
NextAuth doesn't provide sign-up routes because sign-up varies by provider type.
Here are the common patterns for handling user registration.
*/

// 1. OAUTH PROVIDERS (Google, GitHub, etc.)
// ==========================================
// Sign-up happens automatically on first sign-in

// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // This runs on EVERY sign-in attempt (including first-time users)
      console.log('Sign-in attempt:', {
        isNewUser: !user.id, // If no ID, it's a new user
        email: user.email,
        provider: account.provider
      })
      
      // You can add custom logic here for new users
      if (!user.id) {
        console.log('🎉 New user signing up:', user.email)
        // Add custom new user logic here
      }
      
      return true // Allow sign-in (which also creates account if new)
    },
    
    async session({ session, user, token }) {
      // Add custom fields to session
      session.user.id = user.id
      return session
    }
  }
})

// For OAuth providers, the flow is:
// 1. User clicks "Sign in with Google"
// 2. Google authenticates user
// 3. If user doesn't exist in your database, NextAuth creates them automatically
// 4. User is signed in

// 2. CREDENTIALS PROVIDER - MANUAL SIGN-UP
// =========================================
// You must create your own sign-up route and logic

// pages/api/auth/signup.js - CUSTOM SIGN-UP ENDPOINT
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  const { username, email, password } = req.body
  
  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        // Add any other fields you need
        createdAt: new Date(),
      }
    })
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = user
    
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    })
    
  } catch (error) {
    console.error('Sign-up error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// pages/api/auth/[...nextauth].js - CREDENTIALS PROVIDER SETUP
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        // Find user in database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })
        
        if (!user) {
          return null
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValidPassword) {
          return null
        }
        
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  // ... other config
})

// 3. SIGN-UP FORM COMPONENT
// =========================

// components/SignUpForm.js
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      // Call your custom sign-up endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.message)
        return
      }
      
      // Sign-up successful, now sign in
      const signInResult = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false
      })
      
      if (signInResult?.error) {
        setError('Account created but sign-in failed. Please try signing in manually.')
      } else {
        // Success! Redirect or update UI
        window.location.href = '/dashboard'
      }
      
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            minLength={6}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-800">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

// 4. EMAIL PROVIDER - AUTOMATIC SIGN-UP
// ======================================

import EmailProvider from 'next-auth/providers/email'

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For email provider, users are created automatically when they click the magic link
      if (account.provider === 'email') {
        console.log('User signed up/in with email:', user.email)
        // Add any custom logic for email users
      }
      return true
    }
  }
})

// 5. HYBRID APPROACH - COMBINED OAUTH + CREDENTIALS
// =================================================

// pages/auth/signup.js - SIGN-UP PAGE WITH MULTIPLE OPTIONS
import { getProviders, signIn } from 'next-auth/react'
import SignUpForm from '../components/SignUpForm'

export default function SignUpPage({ providers }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        
        {/* OAuth Sign-Up */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Sign up with</h3>
          <div className="space-y-3">
            {Object.values(providers)
              .filter(provider => provider.type === 'oauth')
              .map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Continue with {provider.name}
                </button>
              ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or</span>
          </div>
        </div>
        
        {/* Credentials Sign-Up */}
        <SignUpForm />
        
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers: providers ?? {} },
  }
}

/*
SUMMARY - SIGN-UP PATTERNS:
===========================

1. OAuth Providers (Google, GitHub, etc.):
   - Automatic sign-up on first sign-in
   - No separate sign-up needed
   - Use signIn() callbacks for new user logic

2. Credentials Provider:
   - Create custom /api/auth/signup endpoint
   - Handle validation, password hashing, database storage
   - After sign-up, use signIn() to authenticate

3. Email Provider:
   - Automatic account creation via magic links
   - Users "sign up" by entering email and clicking link

4. Hybrid Approach:
   - Offer both OAuth and credentials sign-up
   - Let users choose their preferred method

KEY POINTS:
- NextAuth handles authentication, not registration
- Sign-up logic is application-specific
- OAuth providers handle sign-up automatically  
- Credentials require custom sign-up endpoints
- Always validate and sanitize sign-up data
- Use NextAuth callbacks for post-signup logic
*/


























###
#
###
