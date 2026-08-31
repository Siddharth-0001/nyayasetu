import { NextResponse } from 'next/server';
import { generateContent } from '@/app/lib/gemini';
import { TRANSLATION_PROMPT } from '@/app/lib/prompts';

export async function POST(request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Text and target language are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        translation: '⚠️ API key not configured. Please add your Gemini API key.' 
      }, { status: 200 });
    }

    const langName = targetLanguage === 'hi' ? 'Hindi (Devanagari script)' : 'English';
    const prompt = `${TRANSLATION_PROMPT}\n\nTranslate to ${langName}:\n\n${text}`;

    const translation = await generateContent(prompt, { temperature: 0.2, maxOutputTokens: 4096 });

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate', details: error.message },
      { status: 500 }
    );
  }
}
