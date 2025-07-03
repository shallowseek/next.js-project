'use client'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import react,{useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { signInSchema } from '../../../schemas/signInSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '../../components/ui/button';
import { Loader2, LoaderCircleIcon } from "lucide-react";
import type { SignInResponse } from "next-auth/react";
import Link from 'next/link'
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
export default function Page() {
    const { data: session, update } = useSession()
    const [isSubmitting, setisSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [mail,setMail]= useState("");
   
    const router = useRouter()

    //zod schema
    const form = useForm <z.infer<typeof signInSchema>>({
      // typeof signUpSchema = ZodObject<{username: ZodString, email: ZodString, ...}>
      // z.infer<typeof signUpSchema> becomes:(This extracts/infers what TypeScript type the schema would produce when validated:)
// type SignUpData = {
//   username: string;
//   email: string;
//   password: string;
// }
      resolver:zodResolver(signInSchema),
      defaultValues:{
        
        email:'',
        password:'',
      }
    })// returns tools objects//
    // useRouter() gives you access to the router object inside your React components.
    // In react-hook-form, the resolver is an optional function you can pass to useForm()
    //  that lets you use an external validation library (like Zod, Yup, Joi, etc.) for form validation.


    //








//now submit logic//
//react hook form gives us submitHandler but it does not submit rather we have to extract value from it //



    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      console.log("Submitting data:", data);
      setisSubmitting(true);
      setError(""); // Clear previous errors
      
      try {
     const result = await signIn('credentials', {
  email: data.email,
  password: data.password,
  redirect: false,
});
        console.log("SignIn result:", result);

        if (result?.error) {
          console.log("Login failed:", result.error);
          setError("Invalid email or password");
        } else if (result?.ok) {
          // Wait for session to update
          await update();
          
          // Get fresh session data
          const updatedSession = await getSession();
          console.log("Updated session:", updatedSession);
          
          const userId = updatedSession?.user?._id;
          if (userId) {
            router.replace(`/dashboard/${userId}`);
          } else {
            router.replace('/dashboard');
          }
        } else {
          setError("Login failed. Please try again.");
        }
      } catch (error) {
        router.replace('/dashbaord')
        console.error("SignIn error:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setisSubmitting(false);
      }
    }



if(session){
    const userId = session.user?._id;
        if (userId) {
            router.replace(`/dashboard/${userId}`);
        } else {
            router.replace('/dashboard');
        }
        return null;
}

else{
    //for user with who we don''t have  establish session yet//

    
    return (
    <>
     {/* // You must manually call signIn('credentials', { email, password }) to:
    // Send a POST request to /api/auth/callback/credentials
    // Trigger the authorize() function in your Credentials Provider. */}
      {/* Not signed in <br />
      <button className="bg-orange-500" onClick={() => signIn()}>Sign in</button> */}
        <div className='"flex justify-center items-center h-72 bg-gray-100 ml-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
      <div className='text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Join Mystery Message
        </h1>
        <p className='mb-4'>Sign in to start your anonymus adventures</p>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email...." {...field}
                value={mail}
                onChange={(e)=>{
                  setMail(e.target.value)
                  field.onChange(e)

                }} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />



       
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password...." {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        {error &&  <p>
            Wrong Credentials{' '} </p>}
         <Button type="submit">Sign-In
        
        
                </Button>
      </form>
    </Form>    
     <div className="text-center mt-4">
              <p>
                Not a Member?{' '}
                {/* In React's JSX syntax, {' '} means "insert a literal space character here". */}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                        Sign Up
                </Link>
              </p>
    
    
        </div>
      
      
      </div>
      </div>
    </>
  )
}}