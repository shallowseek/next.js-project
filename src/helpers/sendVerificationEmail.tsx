import {resend} from '../lib/resend';
import VerificationEmail from './verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

//next.js-3=>claud.ai

// import * as React from 'react';

// interface EmailTemplateProps {
//   firstName: string;
// }

// export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
//   firstName,
// }) => (
//   <div>
//     <h1>Welcome, {firstName}!</h1>
//   </div>
// );

export async function sendVerificationEmail(
  email:string,
  username:string,
  verifyCode:string,
):Promise<ApiResponse>{
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],//['delivered@resend.dev'],
      subject: 'Email regarding Verification',
      react: VerificationEmail({ username: username, otp:verifyCode }),
    });
    console.log("here is the data we got",data)
     return {success:false, message:"Verification email sent successfully",}
    
  } catch (error) {
    console.error(error)
    return {success:false, message:"your email failed"}
  }
}