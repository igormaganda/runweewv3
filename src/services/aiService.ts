import { ImageAnalysis, Settings } from '../types';

export type AIEngine = 'gemini' | 'zai';

export const generateRunStory = async (
  runData: any,
  notes: string,
  engine: AIEngine = 'zai',
  voiceTranscript?: string
) => {
  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runData,
        notes,
        voiceTranscript,
        engine
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

export const getDefaultLLM = async (): Promise<Settings> => {
  try {
    const response = await fetch('/api/admin/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    return {
      default_llm: { model: 'glm-4', engine: 'zai' },
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

    if (!response.ok) throw new Error('Media analysis failed');
    return await response.json();
  } catch (error) {
    console.error('Error analyzing media:', error);
    return {
      description: 'Une activité de course.',
      tags: ['course', 'effort']
    };
  }
};
