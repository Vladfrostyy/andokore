import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to create a chat session
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are TapBio AI, a helpful assistant for the TapBio minimalist bio-link builder app (powered by AndoKore). 
      You help users write catchy bios, suggest link titles, and provide technical support for the app.
      Keep your answers concise, helpful, and friendly.`,
    },
  });
};

export const sendMessageToGemini = async (
  chat: Chat, 
  message: string, 
  useThinking: boolean
): Promise<string> => {
  try {
    const config = useThinking 
      ? { thinkingConfig: { thinkingBudget: 32768 } } 
      : {};

    const response = await chat.sendMessage({ 
      message,
      config
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};