import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FoodAnalysisResult {
  name: string;
  baseCalories: number;
  purine: 'low' | 'medium' | 'high';
  gi: 'low' | 'medium' | 'high';
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  detectedIngredients: string[];
  bestCookingMethod: 'steamed' | 'braised' | 'fried' | 'grilled';
  cookingMethodConfidence: string;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
  // Remove data:image/...;base64, prefix if it exists
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Analyze this image of food. Identify the primary dish and its main ingredients. 
            Estimate nutritional values per serving (approx. 200g). 
            Identify the likely current cooking method and suggest a healthy alternative if necessary.
            Return the result in JSON format fitting the schema.`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Display name of the food" },
          baseCalories: { type: Type.NUMBER, description: "Estimated kcal for the base version" },
          purine: { type: Type.STRING, enum: ["low", "medium", "high"] },
          gi: { type: Type.STRING, enum: ["low", "medium", "high"] },
          nutrients: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
            },
            required: ["protein", "fat", "carbs", "fiber"]
          },
          detectedIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          bestCookingMethod: { 
            type: Type.STRING, 
            enum: ["steamed", "braised", "fried", "grilled"],
            description: "Suggested healthiest preparation method"
          },
          cookingMethodConfidence: { type: Type.STRING, description: "Brief description of current cooking method detected" }
        },
        required: ["name", "baseCalories", "purine", "gi", "nutrients", "detectedIngredients", "bestCookingMethod"]
      }
    }
  });

  if (!response.text) {
    throw new Error("AI response was empty");
  }

  return JSON.parse(response.text.trim());
}
