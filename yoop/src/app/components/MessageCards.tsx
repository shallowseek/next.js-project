import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from 'lucide-react'
import { Message } from '@/models/user.model'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardsProps={
    message:Message;
    onMessageDelete:(messageId:string)=>void;
}


const MessageCards = ({message, onMessageDelete}:MessageCardsProps) => {
    const handleDeleteConfirm = async()=>{
    const response =  await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        const _id = message._id.toString()
        onMessageDelete(_id)
    }
  return (
    <><div>Message Card</div>
    <Card>
  <CardHeader>
    <CardTitle>These are your Messages</CardTitle>
       <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          {/* Yes, AlertDialogAction is built on top of a button and does accept onClick.
It is a styled wrapper over a <button> element, intended to be used
     inside an <AlertDialog> (usually for "Confirm" or "Proceed" actions). */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription></CardDescription>
    <CardAction></CardAction>
  </CardHeader>
  <CardContent>
  
  </CardContent>
  <CardFooter>
    <p>Hope You Like It!!!</p>
  </CardFooter>
</Card>
</>
    

      
    
  )
}

export default MessageCards
