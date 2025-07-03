why do we write use client ?
ChatGPT said:

In a Next.js 13+ (App Router) project, we write 'use client' at the top of a file to tell Next.js that the component should be rendered on the client-side, not on the server.
🔍 Why is 'use client' needed?

By default, files inside the app/ directory are server components. These run on the server and do not have access to browser-only features like:

    useState, useEffect

    window or document

    localStorage

    client-side event handlers like onClick

So if you want to use any of these client-side features, you must explicitly tell Next.js by adding:

'use client'

at the very top of your file.
🧠 Example

✅ This works (has 'use client'):

'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

❌ This will throw an error (no 'use client', but using useState):

// ❌ No 'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0) // 🔥 Error: useState can only be used in client components
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

🔒 Important Rules

    'use client' must be the first line in the file (before any imports).

    It only works in components inside the app/ directory.

    It’s not needed in pages/ directory apps — those are client components by default.

Let me know if you'd like to know when to avoid 'use client' or how to split components between server and client.
