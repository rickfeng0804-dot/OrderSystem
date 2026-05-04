import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

export async function recognizeMenuFromImage(base64Image: string): Promise<MenuItem[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const imageData = base64Image.split(",")[1] || base64Image;
  const mimeType = base64Image.split(";")[0].split(":")[1] || "image/jpeg";

  const prompt = `
    Analyze this restaurant menu image and extract all menu items.
    For each item, provide:
    - name (the name of the dish)
    - price (the numerical price)
    - category (one of: 飯類, 麵類, 湯類, 小菜, 套餐)
    - description (a short description of the item)
    - image (pick a single emoji representing the dish)
    - sizes (optional size options, usually '正常' or '大碗' with priceModifier)
    - addOns (optional add-ons listed for the dish)

    Format the output as a valid JSON array of objects following the MenuItem structure.
    If multiple sizes are present, reflect them in sizes array with priceModifier relative to the base price.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageData, mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER },
            description: { type: Type.STRING },
            image: { type: Type.STRING },
            sizes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  priceModifier: { type: Type.NUMBER }
                },
                required: ["name", "priceModifier"]
              }
            },
            addOns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                },
                required: ["name", "price"]
              }
            }
          },
          required: ["name", "category", "price", "description", "image"]
        }
      }
    }
  });

  try {
    const rawItems = JSON.parse(response.text);
    return rawItems.map((item: any, index: number) => ({
      ...item,
      id: `ai_${Date.now()}_${index}`,
      sizes: item.sizes || [{ name: "正常", priceModifier: 0 }],
      addOns: item.addOns || []
    }));
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("無法識別菜單內容，請確保圖片清晰。");
  }
}
