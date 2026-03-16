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
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participantsCount: number;
  daysLeft: number;
  imageUrl: string;
}
