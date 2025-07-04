// src/app/api/suggest-messages/route.ts
import { groq } from '@ai-sdk/groq';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';





export async function GET() {
  const result = await generateText({
    model: groq('qwen-qwq-32b'),
    providerOptions: {
      groq: { reasoningFormat: 'parsed' },
    },
    prompt: 'Create a list of four open-ended and engaging questions formatted as a single string.Each question should be seperated by "||".These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience.Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.For example , your output should be structured like this: "What"s a hobby you have recently discovered?||If you could have dinner with any historical figure,who would it be?||WHAT"s a simple thing that makes you happy?".Ensure that questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environemnt.'   
  });// to later apply split and get an array//
console.log("here is teh response we got from ai",result)
  return NextResponse.json(result);
}

