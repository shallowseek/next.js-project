'use client'


// import MessageCards from '@/app/components/MessageCards'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useSession,} from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import {useForm} from 'react-hook-form'

import { toast } from "sonner"







const page = () => {

  const { data: session, status } = useSession();
  console.log("ji",session)
  //first we will get the id from url
  const {id} = useParams();
  console.log("here we got the id", id)
  // then we send request to databse and we can't access data stored in session, since it is public url//
  // we can't do that since this is client component
  // const user = await UserModel.findOne({
  //   _id:id})
  // })Mongoose automatically converts string IDs to ObjectId under the hood — no need to call .toString()
  //  or new ObjectId() unless you're doing complex manual checks.
  // we can send api reuest to any get user data route//


  const[name,setName] = useState("")
  const[available,setAvailable]= useState(false)
  const[isLoading,setIsLoading]=useState(false)
  const [showNotAcceptingError, setShowNotAcceptingError] = useState(false);
  

  useEffect(() => {
    // Only run if ID exists
    const fetchUser = async () => {
      const response = await axios.get(`/api/user/${id}`)
      // You can set state here if needed, e.g. setname(response.data.name)
      setName(response.data.user.username)
    };
    fetchUser();
  }, [id]);


 const form = useForm()//to create a central form state




 const handleSubmit = async (data: { message: string }) => {
  setIsLoading(true);
  setShowNotAcceptingError(false); // reset it on every submission

  const endTime = Date.now();

  try {
    const response = await axios.get(`/api/accept-messages/?username=${name}`);
    const isAccepted = response.data.user.isAcceptedMessage;

    if (isAccepted) {
      const postRes = await axios.post('/api/send-message', {
        content: data.message,
        id,
      });

      if (postRes.status === 200) {
        toast("Message has been sent", {
          description: `${new Date(endTime).toLocaleString()}`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        // form.setValue("message","")// this just updates value in field in form state
        form.reset({ message: "" });//so we will use reset which The form reset happens in the form state, not the UI directly — but 
        // it automatically updates the UI because react-hook-form binds the UI to its state.
      }

    } else {
      setShowNotAcceptingError(true); // show red error line
    }
  } catch (error) {
    console.error("Failed to send message", error);
    toast("Something went wrong");
  }

  setIsLoading(false);
};






  return (
    <div className="bg-black text-white">
      <div className="flex flex-col h-screen">
  {/* Top Box - 1/2 height */}
  <div className="relative h-5/8 border-b px-6 pt-6">
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-3xl font-bold">PUBLIC PROFILE LINK</h2>
      <div>
        <p className='text-white bg-black  text-left'>{`Send anonymous message to ${name}.`}</p>
       {showNotAcceptingError && (
  <p className="text-red-500 text-sm">
    Sorry {name} does not accept messages 😢
  </p>
)}
        </div>
      
<form
  onSubmit={(e) => {
    e.preventDefault(); // stops default behavior
    form.handleSubmit(handleSubmit)(e); // then use your handler
  }}
>
      <input
      {...form.register("message")}
      // we can alo use zod schema
        type="text"
        // name="message"
        placeholder="Love your personality"
        className="w-full max-full px-4 py-2 border rounded-md text-white bg-black focus:outline-none focus:ring-2 focus:ring-blue-500
        mb-4"
      />
      {/* Reset only after a delay

Keep form disabled after submit

Or restore the last message on "Undo" */}

       <div className="flex justify-center">
    <Button className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Send it
    </Button>
  
  </div>
    </form>
    </div>

    {/* Bottom-left button inside top box */}
    <Button className="absolute bottom-4 left-6 bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300">
    Suggest Messages
    </Button>
  </div>

  {/* Bottom Box - 1/2 height */}
  <div className="h-3/8 p-6">
    {/* Empty or future content */}
  </div>
</div></div>
   

  )
}

export default page



