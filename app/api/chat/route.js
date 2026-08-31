import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/app/lib/gemini';
import { LEGAL_CHAT_SYSTEM_PROMPT } from '@/app/lib/prompts';

export async function POST(request) {
  try {
    const { message, history = [], language = 'en' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        error: 'API key not configured',
        response: '⚠️ **Gemini API Key Not Configured**\n\nPlease add your Gemini API key to the environment variables:\n\n1. Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey)\n2. Add it to your `.env.local` file as `GEMINI_API_KEY=your_key`\n3. Or add it in Vercel Dashboard → Settings → Environment Variables\n\nOnce configured, restart the server and try again!' 
      }, { status: 200 });
    }

    const langInstruction = language === 'hi' 
      ? '\n\nIMPORTANT: The user prefers Hindi. Respond primarily in Hindi (Devanagari script). You may use English for legal terms, Act names, and Section numbers.'
      : '';

    const systemInstruction = LEGAL_CHAT_SYSTEM_PROMPT + langInstruction;

    // Convert history to the new SDK format
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: 'System instructions: ' + systemInstruction }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am NyayaSetu, your AI legal assistant for Indian law. I will provide accurate legal information with proper citations while being empathetic and accessible. How can I help you today?' }],
      },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await generateChatResponse(message, chatHistory);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}
