import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean base64 string for API
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.split(',')[1] || dataUrl;
};

// Helper to fetch an image URL and convert to base64
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64", error);
    throw new Error("无法加载图片，请检查网络设置或图片跨域策略");
  }
};

/**
 * Generate a garment image based on a prompt
 */
export const generateGarmentImage = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image (Nano Banana)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Design a standalone piece of clothing: ${prompt}. White background, flat lay or mannequin style, high quality, photorealistic.` }
        ]
      },
      config: {
        // Nano banana doesn't support responseMimeType
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Generate Garment Error:", error);
    throw error;
  }
};

/**
 * Perform the Virtual Try-On
 */
export const generateTryOnResult = async (personBase64: string, garmentBase64: string): Promise<string> => {
  try {
    const cleanedPerson = cleanBase64(personBase64);
    const cleanedGarment = cleanBase64(garmentBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming inputs are treated as generic images
              data: cleanedPerson
            }
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanedGarment
            }
          },
          {
            text: "Generate a full-body photorealistic image of the person in the first image wearing the clothing from the second image. Maintain the person's pose, facial features, and background. Ensure the clothing fits naturally."
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No try-on image generated");

  } catch (error) {
    console.error("Try-On Error:", error);
    throw error;
  }
};