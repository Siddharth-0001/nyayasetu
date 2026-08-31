import { NextResponse } from 'next/server';
import { generateContent } from '@/app/lib/gemini';
import { DOCUMENT_GENERATION_PROMPT } from '@/app/lib/prompts';

export async function POST(request) {
  try {
    const { documentType, fields, language = 'en' } = await request.json();

    if (!documentType || !fields) {
      return NextResponse.json({ error: 'Document type and fields are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        response: '⚠️ **Gemini API Key Not Configured**\n\nPlease add your Gemini API key to generate documents.\n\n1. Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)\n2. Add `GEMINI_API_KEY=your_key` to `.env.local`' 
      }, { status: 200 });
    }

    const langNote = language === 'hi' 
      ? '\n\nGenerate the document in Hindi (Devanagari script) with English legal terms. Include both Hindi and English versions if possible.'
      : '\n\nGenerate the document in English following standard Indian legal format.';

    const fieldDetails = Object.entries(fields)
      .map(([key, value]) => `- ${key}: ${value || '[TO BE FILLED]'}`)
      .join('\n');

    const prompt = `${DOCUMENT_GENERATION_PROMPT}${langNote}\n\nGenerate a ${documentType} document with the following details:\n${fieldDetails}\n\nPlease generate the complete legal document format:`;

    const response = await generateContent(prompt, { temperature: 0.5 });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document', details: error.message },
      { status: 500 }
    );
  }
}
