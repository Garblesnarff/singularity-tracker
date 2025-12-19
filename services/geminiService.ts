import { GoogleGenAI, Type } from "@google/genai";
import { INGESTION_PROMPT } from "../constants";
import { Claim } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTechPost = async (text: string): Promise<Claim[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: text,
    config: {
      systemInstruction: INGESTION_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            raw_text: { type: Type.STRING },
            summary: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            claim_type: { type: Type.STRING, enum: ["factual", "prediction", "analysis", "speculation"] },
            sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral", "mixed"] },
            significance: { type: Type.NUMBER },
            entities: {
              type: Type.OBJECT,
              properties: {
                companies: { type: Type.ARRAY, items: { type: Type.STRING } },
                people: { type: Type.ARRAY, items: { type: Type.STRING } },
                products: { type: Type.ARRAY, items: { type: Type.STRING } },
                institutions: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            is_prediction: { type: Type.BOOLEAN },
            prediction_timeframe: { type: Type.STRING, nullable: true },
            search_queries: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "category", "claim_type", "significance", "entities"]
        }
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("No response from Gemini.");
  }

  try {
    const data = JSON.parse(jsonText) as Claim[];
    return data;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Failed to parse Gemini response.");
  }
};
