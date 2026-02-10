
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const getGeminiResponse = async (prompt: string, chatHistory: {role: 'user' | 'model', text: string}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Transform our chat history into the format expected by the SDK
  const contents = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model' as any,
    parts: [{ text: msg.text }]
  }));

  // Add the current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. Please try again or contact J. Bailey directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting right now. Please try again in a moment.";
  }
};
