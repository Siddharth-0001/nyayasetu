import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model name to use across the app
const MODEL_NAME = 'gemini-3.6-flash';

export function getAI() {
  return ai;
}

export function getModelName() {
  return MODEL_NAME;
}

export async function generateChatResponse(message, history = [], systemInstruction = '') {
  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 4096,
      systemInstruction: systemInstruction || undefined,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}

export async function generateContent(prompt, config = {}) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      temperature: config.temperature ?? 0.5,
      topP: config.topP ?? 0.85,
      maxOutputTokens: config.maxOutputTokens ?? 8192,
      ...config,
    },
  });

  return response.text;
}
