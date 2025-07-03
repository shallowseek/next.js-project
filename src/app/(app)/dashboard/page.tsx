'use client'
import React, { useCallback, useEffect, useState } from 'react'
import UserModel, { Message } from '@/models/user.model'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { User } from 'next-auth'
import { Button } from '@/app/components/ui/button'
import { Switch } from '@/app/components/ui/switch'
import { Separator } from '@/app/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCards from '@/app/components/MessageCards'
const Page = () => {
    const[messages, setMessages] = useState<Message[]>([])
    // "This value is an array of objects shaped like Message."
    const[isLoading, setIsLoading]= useState(false)
    const[isSwitchLoading,setIsSwitchLoading]= useState(false)



    const handleDeleteMessage = (messageId:string)=>{

        setMessages(messages.filter((message)=>{
            message._id.toString()!== messageId
        }))
    }
    // we will use optimised UI

const {data:session} =useSession()
const form = useForm({
    resolver:zodResolver(acceptMessageSchema),
}
)

const acceptMessages = form.watch('isAcceptedMessage')
const fetchAcceptMessage=  useCallback(async ()=>{
        
    setIsSwitchLoading(true);
    try {
        const response= await axios.get<ApiResponse>('/api/accept-messages')
        // “Hey, the data I expect in this response will follow the shape defined
        //  by the ApiResponse type or interface.”
        console.log("this is what i get as http and api response==>>",response)
        form.setValue('isAcceptedMessage', response?.data?.isAcceptingMessages ?? false)
        // ✅ response.data exists because Axios adds it for convenience.
        // the presence of .data in the response is not from the native Fetch API,
        //  but rather from Axios, the library you're using.
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>        
    }
    finally{
        setIsSwitchLoading(false)
    }


},[form.setValue])

const fetchMessages= useCallback(async (refresh:boolean=false)=>{
    //         If you try to use Mongoose (or UserModel) inside a file with "use client" at the top — it will crash with an error like:
//     ❌ Module not found: Can't resolve 'mongoose'
// That’s because client components run in the browser, and Mongoose is Node.js-only (server-only).
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages")
            setMessages(response.data.messages||[])
            // if(refresh){

            // }
        } catch (error) {
               const axiosError = error as AxiosError<ApiResponse> 
        }
        finally{
            setIsLoading(false)

        }        
},[setIsLoading,setMessages])

useEffect(()=>{
    if(!session || !session.user){
        return 
    }
    fetchMessages()
    fetchAcceptMessage()


},[session,form.setValue,fetchAcceptMessage,fetchMessages])




const data={acceptMessage:!acceptMessages}
// to make true false and false=>true//
//handle switch change
const handleSwitchChange = async()=>{
    try {
        const response = await axios.post<ApiResponse>("/api/accept-messages",data)
        if(response.status===200){
            form.setValue('isAcceptedMessage',response?.data?.isAcceptingMessages??false)
            
        }
    } catch (error) {
         const axiosError = error as AxiosError<ApiResponse> 
    }

}

const{username} = session?.user as User
// To get the current URL in a client component in Next.js, you can use the built-in usePathname()
//  and useSearchParams() hooks from next/navigation, or use the native window.location.
const baseUrl = `${window.location.protocol}/${window.location.host}/`
const profileUrl = `${baseUrl}/u/${username}`



// to clipboard method

const copyToClipboard= ()=>{
    navigator.clipboard.writeText(profileUrl )
}


if(!session || !session.user){
    // just double checking//
    return(<><h1>Please Login</h1></>)
}
else{return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

        <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>
                Copy Your Unique Link 
            </h2>{" "}
            <div className='flex items-center'>
                <input type="text"
                value={profileUrl} 
                disabled
                className='input input-bordered w-full p-2 mr-2'/>
                <Button onClick={copyToClipboard}>Copy</Button>
            </div>
        </div>

        <div className='mb-4'>
            <Switch
            {...form.register('isAcceptedMessage')}
            checked={acceptMessages}
//             checked is a boolean value:
// checked={true} = Switch is ON
// checked={false} = Switch is OFF
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}/>
            <span className='ml-2'>
                Accept Messages:{acceptMessages?'On':'Off'}
            </span>
             </div>
        <Separator />
        <Button 
        className='mt-4'
        variant="outline"
        onClick={(e)=>{
            e.preventDefault()
            fetchMessages(true)

        }}>
        {isLoading ? (
            <Loader2 className='h-4 w-4 animate-bounce' />

        ):(
            <RefreshCcw className='h-4 w-4'/>
        )}
        </Button>
        <div className='mt-4 grid grid-cols-1 md:grid-cols-2'>
            {messages.length >0?(
                messages.map((message) => (
                    <MessageCards
                    key={message._id.toString()}
                    message={message}
                    onMessageDelete={handleDeleteMessage} />
                ))
            ):(
                <p>No Message to Display</p>
            )}
        </div>
        
        
     
    </div>)
    
}
  
}
export default Page
