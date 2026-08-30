import { NextResponse } from 'next/server';
import { getAnalysisModel } from '@/app/lib/gemini';
import { DOCUMENT_ANALYSIS_PROMPT } from '@/app/lib/prompts';

export async function POST(request) {
  try {
    const { content, fileType, language = 'en' } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Document content is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        response: '⚠️ **Gemini API Key Not Configured**\n\nPlease add your Gemini API key to use the Document Analyzer.\n\n1. Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)\n2. Add `GEMINI_API_KEY=your_key` to `.env.local`' 
      }, { status: 200 });
    }

    const model = getAnalysisModel();

    const langNote = language === 'hi' 
      ? '\n\nPlease provide the analysis in Hindi (Devanagari script). Keep legal terms and Act/Section names in English.'
      : '';

    const prompt = `${DOCUMENT_ANALYSIS_PROMPT}${langNote}\n\n--- DOCUMENT TO ANALYZE ---\nFile Type: ${fileType || 'text'}\n\n${content}\n\n--- END OF DOCUMENT ---\n\nPlease provide your detailed analysis:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document', details: error.message },
      { status: 500 }
    );
  }
}
