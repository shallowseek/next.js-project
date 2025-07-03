'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {  verifySchema } from '@/schemas/verifySchema';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios'
import { Button } from "../../../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"



function verify() {
    const[verifyCode, setverifyCode] = useState('')
    const router = useRouter()
    const param = useParams<{username:string}>()
    // This is a TypeScript generic — it helps you tell TypeScript what keys and types to
    //  expect from the route params, so it gives you autocomplete and type safety.


    // , useParams() automatically returns the parameters 
    // of the current route — you do not have to pass anything manually.
    //it returns a param object in which there us username key //
    const form= useForm <z.infer<typeof verifySchema>>({
       
             resolver:zodResolver(verifySchema),
             defaultValues:{
                    code:''
                  }
                })



const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
       try {
        //first we will verify submitted dat through zod by giving data type as verifySchema object//
        
     
          const response = await axios.post<ApiResponse>('/api/verify-code/', {  username: param.username, code:data.code})
//           The second argument in axios.post(url, data, config) is the body, which we are setting to null here because you'
//           re not sending any body.
// The third argument is the Axios config, where we pass params.
          console.log("this is what we got as response",response.data)
          Response.json({
            message:"your code is verified",
            data,
          },{status:200})
          router.replace(`/dashboard/${param.username}`)
       } 
       
       catch (error) {


        console.error("error in sign-in", error)
            const axiosError = error as AxiosError<ApiResponse>
            console.log("hiiiiii",axiosError)
          
        
       }}


        

  return (
    <div className="flex justify-center items-center  ml-100 w-full max-w-md p-8 space-y-8  rounded-lg shadow-md mt-50">
        <h1>Verification Code:</h1>
        <br/>
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="code...." {...field} 
                // input will return string
                value={verifyCode}
                onChange={(e)=>{
                    setverifyCode(e.target.value)
                    field.onChange(e)}}/>
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='text-black bg-white'>Submit</Button>
      </form>
    </Form>
  

    </div>
  )
}

export default verify
