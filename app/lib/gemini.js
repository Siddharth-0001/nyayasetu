import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function getChatModel() {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 4096,
    },
  });
}

export function getAnalysisModel() {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  });
}

export function getDocumentModel() {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.5,
      topP: 0.85,
      maxOutputTokens: 8192,
    },
  });
}

export function getTranslationModel() {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
    },
  });
}
