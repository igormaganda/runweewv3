export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export type RunCategory = 'Trail' | 'Marathon' | 'Training' | 'Lifestyle' | 'Race';

export interface RunData {
  distance: number; // km
  pace: string; // min/km
  elevation: number; // m
  time: string;
  heartRate?: number;
}

export interface Runner {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  stats: {
    totalDistance: number;
    storiesPublished: number;
  };
}

export interface RunStory {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: RunCategory;
  imageUrl: string;
  author: Runner;
  date: string;
  runData: RunData;
  isFeatured?: boolean;
  isTrending?: boolean;
  status?: 'published' | 'draft';
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participantsCount: number;
  daysLeft: number;
  imageUrl: string;
}

export interface Settings {
  default_llm: { model: string; engine: string };
  llm_enabled: { zai: boolean; gemini: boolean };
}

export interface AdminStats {
  users: number;
  stories: number;
  published: number;
  drafts: number;
  llmUsage: { engine: string; count: number }[];
}

export interface ImageAnalysis {
  description: string;
  tags: string[];
  emotion?: string;
}

export type AIEngine = 'gemini' | 'zai';
