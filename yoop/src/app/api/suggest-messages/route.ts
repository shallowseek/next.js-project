// src/app/api/suggest-messages/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Say hello in a friendly way' },
  ],
});

    return NextResponse.json({ response: response.choices[0].message });}
  
  
  catch (error) {
  console.error("FULL ERROR OBJECT:", error);
  
  if (error instanceof OpenAI.APIError) {
    const { name, status, headers, message } = error;
    return NextResponse.json({ name, status, headers, message });
  } else {
    return NextResponse.json({
      error: 'An unexpected error occurred',
      message: (error as any)?.message,
      stack: (error as any)?.stack,
    });
  }
}
}


