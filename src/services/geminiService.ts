import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3.1-pro-preview";

export const generateRunStory = async (
  runData: any,
  notes: string,
  voiceTranscript?: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    You are an expert sports journalist for RunWeek Magazine, a high-end running publication.
    Your task is to transform raw running data and personal notes into a polished, inspiring editorial article.

    RUN DATA:
    - Distance: ${runData.distance} km
    - Pace: ${runData.pace} min/km
    - Elevation: ${runData.elevation} m
    - Time: ${runData.time}
    
    RUNNER NOTES:
    "${notes}"
    
    ${voiceTranscript ? `VOICE TRANSCRIPT CONTEXT: "${voiceTranscript}"` : ''}

    INSTRUCTIONS:
    1. Create a catchy, magazine-style title.
    2. Write a compelling introduction (2-3 sentences).
    3. Write a narrative story of the run (3-4 paragraphs). Use a mix of technical data and emotional storytelling.
    4. Include a "Training Insight" section based on the data.
    5. The tone should be inspiring, authentic, and professional.
    6. Return the result in JSON format with the following structure:
       {
         "title": "...",
         "excerpt": "...",
         "content": "...",
         "category": "Trail" | "Marathon" | "Training" | "Lifestyle" | "Race",
         "trainingInsight": "..."
       }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};
