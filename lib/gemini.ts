import { GoogleGenAI } from '@google/genai';

// Initialize the GoogleGenAI instance for server-side usage
// with the required aistudio-build User-Agent header.
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
