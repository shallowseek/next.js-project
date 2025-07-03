'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from 'next/link'
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { set } from 'mongoose';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { signIn } from 'next-auth/react';
import { Button } from "../../components/ui/button"
import { Loader2, LoaderCircleIcon } from "lucide-react";
import {
  Form,
  FormControl,
//   Wraps your input
// Helps with consistent styling and focus ring logic.
  FormDescription,
  // Displays validation errors automatically from React Hook Form.
  FormField,
  // FormField connects everything to react-hook-form
//   Bridge between react-hook-form and the UI.
// It connects your form input (<Input />) to form state using control and name.
  FormItem,
//   Wraps the entire input field + label + message.
// Basically a container with layout/styling.
  FormLabel,
//   A styled <label> tag.
// Optional but good for accessibility and UX.
  FormMessage,
} from "../../components/ui/form"
import { Input
//    The actual form input element.
// Comes from shadcn/ui, already styled and works with Tailwind.
 } from "../../components/ui/input"
//wil work for default get method//
function Page() {

    const [username,setUsername]= useState("");
    const[userNameMessage, setuserNameMessage]=useState('');
    const[isCheckingUsername, setisCheckingUsername]=useState(false)// loading state//
    const [isSubmitting, setisSubmitting] = useState(false)
    const debouncedUsername = useDebounce(username, 300);
    const router = useRouter()

    //zod schema
    const form= useForm <z.infer<typeof signUpSchema>>({
      // typeof signUpSchema = ZodObject<{username: ZodString, email: ZodString, ...}>
      // z.infer<typeof signUpSchema> becomes:(This extracts/infers what TypeScript type the schema would produce when validated:)
// type SignUpData = {
//   username: string;
//   email: string;
//   password: string;
// }
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:'',
      }
    })// returns tools objects//
    // useRouter() gives you access to the router object inside your React components.
    // In react-hook-form, the resolver is an optional function you can pass to useForm()
    //  that lets you use an external validation library (like Zod, Yup, Joi, etc.) for form validation.


    //



    //to send API request to check whether usernaame is available//
    useEffect((()=> {
// we will first check if we have any value in debounced Username because this hook will run on first reload//
      const checkUsernameUnique = async()=>{
        if(debouncedUsername){
      // while we are checking , we need to enable checking username state//
          setisCheckingUsername(true)
          setuserNameMessage('')// this variable will hold the value we got from api, so we are emptying it
          //so that if there exista any value of previous request, we can nullify it
          try {
            //we can also use fetch//
            // will return a promise//
            const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
            console.log("hi")
            //    {
            //   // The { some: 'payload' } is 
            //   // the request body — this is the JSON data you are sending in the POST request but not in get request//
            // params: { username: debouncedUsername, mode: 'edit' }
             console.log("✅ Response from server:", response);
              console.log("📦 Response message:", response.data.message);
              //these logs will be browser console since this is frontned part and this javascript and react runs in browser engine//
            if(response.status===200){
              setuserNameMessage(response.data.message)
            }
}
          catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            // Meaning: "Trust me TypeScript, this is actually this type"
//             Type assertion: Telling TypeScript "treat this error as an AxiosError"
// The <ApiResponse> is a generic specifying what type of data the error response contains
            setuserNameMessage(axiosError.response?.data.message||"error checking username")



          }
          finally{
            setisCheckingUsername(false)
            //now since we have send requestv and got respnse, we will set load state to false//
          }
        }
         
      }
      checkUsernameUnique()
}),[debouncedUsername])




//now submit logic//
//react hook form gives us submitHandler but it does not submit rather we have to extract value from it //


const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
  // preventDefault()
  // we would again verify data we got by zod
  console.log("this is data we submit to form system and got", data);
  // first i will activate my laoding state//
  // or we can remove sign-up button and put loader there from lucid-react
  setisSubmitting(true)
  try {
      // const response= signIn('credentials',data);
      // console.log("this is the sign-in data",response)===>>> won't use it here because first we will vrify with code//
    //calling this will submit data with post method to ..../callback/credentials
    const response = await axios.post<ApiResponse>('/api/sign-up', data)
    console.log("this is what we got as response",response.data)
    
    //what to do after submitting form//
//     If you want to send data:

// If you want to send a POST request and then redirect:


router.replace(`/verify/${username}`);
// i have to make /verify/username router/
    
    // router.replace('/verify/username') (from Next.js useRouter())
    //  performs a client-side navigation — it's always a GET request, never a POST.
    setisSubmitting(false)

  } catch (error) {
    console.error("error in sign-in", error)
    const axiosError = error as AxiosError<ApiResponse>
    console.log("hiiiiii",axiosError)
    setisSubmitting(false)
    
  }


}



    
  return (
   
  


    <div className='"flex justify-center items-center min-h-screen ml-100'>
      <div className='w-full max-w-md p-8 space-y-8 rounded-lg shadow-md'>
      <div className='text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Join Mystery Message
        </h1>
        <p className='mb-4'>Sign up to start your anonymus adventures</p>
      </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* //we use small form to connect all inputs.feilds to common form state which we wrap in//  */}



        
        <FormField
          control={form.control}// here we are passing control of this big form to that small form//
          name="name"
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} 
    //               //               onChange={field.onChange}You are telling react-hook-form:
    // // “Hey, the value of this input just changed — please update the form state!”
    //             onChange={(e)=>{setUsername(e.target.value)
    //               field.onChange(e)
    //               // If you don’t call field.onChange(e), React Hook Form won’t know the field changed, and:
    //               //       Validation won’t work
    //               //       Errors won’t show
    //               //       Submission will have old values
    //             }}
    //             value={
    //               // we need to change it since we are checking whether username is unique//
    //               //and whenever value of username will change => state will change and hence useState will come into use//

    //               username
    //             } 
    />
              </FormControl>
              <FormDescription>
                This is official  name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />





        <FormField
          control={form.control}// here we are passing control of this big form to that small form//
          name="username"
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                  //               onChange={field.onChange}You are telling react-hook-form:
    // “Hey, the value of this input just changed — please update the form state!”
                onChange={(e)=>{setUsername(e.target.value)
                  field.onChange(e)
                  // If you don’t call field.onChange(e), React Hook Form won’t know the field changed, and:
                  //       Validation won’t work
                  //       Errors won’t show
                  //       Submission will have old values
                }}
                value={
                  // we need to change it since we are checking whether username is unique//
                  //and whenever value of username will change => state will change and hence useState will come into use//

                  username
                } />
              </FormControl>
              {isCheckingUsername && <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/>}
              <p className={`text-sm ${userNameMessage==="username is available"?'text-green-500':'text-red-500'}`}>test {userNameMessage}

              </p>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />




          <FormField
          control={form.control}// here we are passing control of this big form to that small form//
          name="email"
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Please enter your email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormDescription>
                This is your credential.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />




          <FormField
          control={form.control}// here we are passing control of this big form to that small form//
          name="password"
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}/>
                {/* The value prop in an <input> element controls what is shown inside the input field.
➕ It makes the input a controlled component. */}
              </FormControl>
              <FormDescription>
                This is your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
{/* 
        {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin" />} */}
        <Button type="submit" disabled={isSubmitting} className='text-black bg-white'>
            {/* ✅ Prevents the user from interacting with the button. */}
          {
            isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ):('Signup')
          }


        </Button>
        
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            {/* In React's JSX syntax, {' '} means "insert a literal space character here". */}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
            </Link>
          </p>


    </div>
      </div>
      
    </div>
  )
}

export default Page

function preventDefault() {
  throw new Error('Function not implemented.');
}
//  /api/auth/signin

//     This backend route is handled by NextAuth.

//     It processes sign-in requests (for credentials, OAuth, etc.).

//     You don’t define this yourself — NextAuth does everything behind the scenes.

// ✅ /sign-in (your custom sign-in page)

//     This is your frontend React page where users land to sign in.

//     It lives at app/sign-in/page.tsx.

//     When you call signIn(), NextAuth redirects here if you've configured: