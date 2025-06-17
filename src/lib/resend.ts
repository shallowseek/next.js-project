// import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);


// You'll use this resend object throughout your application whenever
//  you need to send emails or interact with other Resend services.