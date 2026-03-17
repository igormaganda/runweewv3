import { GoogleGenAI } from "@google/genai";
import { ImageAnalysis, Settings } from "../types";

const GEMINI_MODEL = "gemini-3.1-pro-preview";
const GEMINI_VISION_MODEL = "gemini-3.1-flash-preview";
const ZAI_MODEL = "glm-4"; // Assuming glm-4 for GLM 4.7 as per Zhipu AI naming
const ZAI_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

export type AIEngine = 'gemini' | 'zai';

export const generateRunStory = async (
  runData: any,
  notes: string,
  engine: AIEngine = 'zai',
  voiceTranscript?: string
) => {
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
    3. Write a narrative story of the run. The story MUST be detailed, sensory, and immersive, with a minimum of 250 words for the "content" field. Focus on the atmosphere, the physical sensations of running, and the mental state of the runner. Use a mix of technical data and emotional storytelling.
    4. Include a "Training Insight" section based on the data, offering professional advice or analysis.
    5. Analyze the emotional core of the run, the terrain described, and the environmental ambiance.
    6. The tone should be inspiring, authentic, and professional, like a high-end editorial piece in a magazine like 'Runner's World' or 'Trails'.
    7. Return the result in JSON format with the following structure:
       {
         "title": "...",
         "excerpt": "...",
         "content": "...",
         "category": "Trail" | "Marathon" | "Training" | "Lifestyle" | "Race",
         "trainingInsight": "...",
         "emotion": "transcendence" | "flow" | "accomplishment" | "resilience" | "performance" | "introspection" | "pain" | "grace",
         "terrain": "mountain" | "sea" | "forest" | "city" | "desert" | "countryside" | "lake" | "canyon",
         "ambiance": "dawn" | "night" | "rain" | "wind" | "snow" | "heat" | "mist" | "sun",
         "intensity": 1-10
       }
    
    IMPORTANT: Return ONLY the JSON object. No markdown formatting like \`\`\`json.
  `;

  if (engine === 'gemini') {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating story with Gemini:", error);
      throw error;
    }
  } else {
    // Z.ai (Zhipu AI / GLM)
    const apiKey = process.env.ZAI_API_KEY || "427a8edd8e6947889f71f2283438c9dd.n20AT6nXD6hcB8RV";
    
    try {
      const response = await fetch(ZAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: ZAI_MODEL,
          messages: [
            { role: "system", content: "You are a helpful assistant that outputs JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Z.ai API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Log generation for stats
      fetch('/api/admin/log-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine, model: (engine as string) === 'gemini' ? GEMINI_MODEL : ZAI_MODEL })
      }).catch(console.error);

      return JSON.parse(content);
    } catch (error) {
      console.error("Error generating story with Z.ai:", error);
      throw error;
    }
  }
};

export const getDefaultLLM = async (): Promise<Settings> => {
  try {
    const response = await fetch('/api/admin/settings');
    if (!response.ok) throw new Error("Failed to fetch settings");
    return await response.json();
  } catch (error) {
    return {
      default_llm: { model: "glm-4", engine: "zai" },
      llm_enabled: { zai: true, gemini: true }
    };
  }
};

export const analyzeMedia = async (file: File): Promise<ImageAnalysis & { transcript?: string }> => {
  const formData = new FormData();
  formData.append('media', file);

  try {
    const response = await fetch('/api/analyze-media', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error("Media analysis failed");
    return await response.json();
  } catch (error) {
    console.error("Error analyzing media:", error);
    return {
      description: "Une activité de course.",
      tags: ["course", "effort"]
    };
  }
};
