import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Book, GeneratedContent, Language } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const getBookRecommendations = async (thought: string, language: Language): Promise<Book[]> => {
  const ai = getAiClient();
  
  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        author: { type: Type.STRING },
        year: { type: Type.STRING },
        description: { type: Type.STRING },
        reason: { type: Type.STRING, description: "Why this fits the user's thought" },
      },
      required: ["title", "author", "description", "reason"]
    }
  };

  const langInstruction = language === 'zh' ? "Provide the response in Simplified Chinese." : "Provide the response in English.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User thought: "${thought}". 
      Act as a wise librarian in a surreal dream library. 
      Analyze the user's thought, mood, and philosophical context.
      Recommend 3 literary works (novels, philosophy, or poetry) that deeply resonate with this thought.
      The works should be profound, classic, or distinctively stylistic.
      ${langInstruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an ethereal librarian. You connect human emotions to great literature.",
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Book[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getBookExcerpt = async (title: string, author: string, language: Language): Promise<GeneratedContent> => {
  const ai = getAiClient();
  const langInstruction = language === 'zh' ? "Provide the content in Simplified Chinese (translated if necessary, preserving poetic feel)." : "Provide the content in English.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a profound, atmospheric excerpt or summary interpretation of "${title}" by ${author}". 
      It should feel like a dream reading experience. Length: about 150-200 words.
      ${langInstruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    return { title: title, content: "The pages are blurry... try again." };
  } catch (error) {
    console.error(error);
    return { title: title, content: "The library is silent right now." };
  }
};

export const getAuthorBio = async (authorName: string, language: Language): Promise<string> => {
    const ai = getAiClient();
    const langInstruction = language === 'zh' ? "Write in Simplified Chinese." : "Write in English.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, atmospheric, and poetic biography/description of the writer ${authorName}. Focus on their writing style and philosophical impact. Keep it under 60 words. ${langInstruction}`,
        });
        return response.text || "";
    } catch (error) {
        return "";
    }
}
