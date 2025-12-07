import { GoogleGenAI } from "@google/genai";
import { PromoDataState, PlatformName, ActionType } from "../types";

// Helper to sanitize JSON string from Markdown code blocks
const extractJson = (text: string): string => {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1] : text;
};

export const fetchPromotions = async (): Promise<PromoDataState> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const platforms = Object.values(PlatformName).join(", ");
  
  const prompt = `
    I need you to act as a travel deal aggregator. 
    Search for the current and upcoming major promotional campaigns for the following websites: ${platforms}.
    
    Specifically look for:
    1. "Double Digit" sales (e.g., 11.11, 12.12).
    2. "Flash Sales" that require login at specific times (e.g., after 12:00 PM).
    3. Bank promotions or App-exclusive deals.
    
    Return the data as a STRICT JSON array of objects inside a markdown code block (\`\`\`json ... \`\`\`).
    Each object should have the following structure:
    {
      "id": "unique_string",
      "platform": "One of [Traveloka, Trip.com, Agoda, Booking.com, AirAsia]",
      "title": "Short catchy title",
      "description": "Brief details",
      "discount": "e.g. 50% OFF",
      "period": "e.g. 10 Dec - 12 Dec",
      "tags": ["Flight", "Hotel", "Flash Sale"],
      "actions": [
        {
          "type": "LOGIN_TIME" | "SPECIFIC_DATE" | "APP_ONLY" | "COUPON_CODE" | "NONE",
          "description": "What the user must do, e.g. 'Login after 12:00 PM'",
          "targetTime": "Optional ISO date or time string"
        }
      ]
    }

    Ensure you cover all 5 platforms. If no specific live data is found for a platform, provide the most common recurring deal for that platform (e.g. AirAsia Super Sale).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT set because we are using googleSearch
      },
    });

    const text = response.text || "";
    const jsonString = extractJson(text);
    
    let promotions = [];
    try {
      promotions = JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse Gemini JSON response, falling back to empty list.", e);
      console.log("Raw text:", text);
    }

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return {
      promotions,
      sources,
      lastUpdated: new Date()
    };

  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};