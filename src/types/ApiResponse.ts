import {Message} from '@/models/user.model'


export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,
    messages?:Message[] //Array<Message>
}