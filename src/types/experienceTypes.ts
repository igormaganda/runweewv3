export type EmotionType = 'transcendence' | 'flow' | 'accomplishment' | 'resilience' | 'performance' | 'introspection' | 'pain' | 'grace';
export type AmbianceType = 'dawn' | 'night' | 'rain' | 'wind' | 'snow' | 'heat' | 'mist' | 'sun';
export type TerrainType = 'mountain' | 'sea' | 'forest' | 'city' | 'desert' | 'countryside' | 'lake' | 'canyon';

export interface EmotionConfig {
  id: EmotionType;
  label: string;
  color: string;
  animation: string;
  description: string;
  icon: string;
}

export interface AmbianceConfig {
  id: AmbianceType;
  label: string;
  icon: string;
  description: string;
}

export interface TerrainConfig {
  id: TerrainType;
  label: string;
  icon: string;
  image: string;
}

export const EMOTIONS: EmotionConfig[] = [
  { id: 'transcendence', label: 'Transcendance', color: 'from-pink-500 to-red-600', animation: 'animate-pulse-glow', description: 'Au-delà des limites', icon: '💫' },
  { id: 'flow', label: 'Flow', color: 'from-blue-400 to-cyan-500', animation: 'animate-wave-flow', description: 'État de grâce', icon: '🌊' },
  { id: 'accomplishment', label: 'Accomplissement', color: 'from-yellow-400 to-orange-500', animation: 'animate-shine', description: 'Mission accomplie', icon: '🏆' },
  { id: 'resilience', label: 'Résilience', color: 'from-red-500 to-rose-400', animation: 'animate-heartbeat', description: 'Force surmontée', icon: '💪' },
  { id: 'performance', label: 'Performance', color: 'from-yellow-300 to-yellow-600', animation: 'animate-speed', description: 'Effort absolu', icon: '⚡' },
  { id: 'introspection', label: 'Introspection', color: 'from-purple-500 to-indigo-400', animation: 'animate-float', description: 'Voyage intérieur', icon: '🌙' },
  { id: 'pain', label: 'Douleur', color: 'from-gray-700 to-red-900', animation: 'animate-embers', description: 'Épreuve vaincue', icon: '🔥' },
  { id: 'grace', label: 'Grâce', color: 'from-green-400 to-emerald-300', animation: 'animate-sparkle', description: 'Moment magique', icon: '✨' },
];

export const AMBIANCES: AmbianceConfig[] = [
  { id: 'dawn', label: 'Aube Radieuse', icon: '🌅', description: 'Première lumière, espoir' },
  { id: 'night', label: 'Nuit Mystique', icon: '🌙', description: 'Course nocturne, étoiles' },
  { id: 'rain', label: 'Sous la Pluie', icon: '🌧️', description: 'Élément déchaîné' },
  { id: 'wind', label: 'Vent de Face', icon: '💨', description: 'Résistance' },
  { id: 'snow', label: 'Neige & Glace', icon: '❄️', description: 'Extrême nord' },
  { id: 'heat', label: 'Chaleur Extrême', icon: '🔥', description: 'Désert, été' },
  { id: 'mist', label: 'Brume Matinale', icon: '🌫️', description: 'Mystère' },
  { id: 'sun', label: 'Grand Soleil', icon: '☀️', description: 'Lumière pure' },
];

export const TERRAINS: TerrainConfig[] = [
  { id: 'mountain', label: 'Montagne', icon: '🏔️', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
  { id: 'sea', label: 'Mer', icon: '🌊', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800' },
  { id: 'forest', label: 'Forêt', icon: '🌲', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800' },
  { id: 'city', label: 'Ville', icon: '🏙️', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800' },
  { id: 'desert', label: 'Désert', icon: '🏜️', image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=800' },
  { id: 'countryside', label: 'Campagne', icon: '🚜', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
  { id: 'lake', label: 'Lac', icon: '💧', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800' },
  { id: 'canyon', label: 'Canyon', icon: '🏜️', image: 'https://images.unsplash.com/photo-1505051508008-923feaf90180?auto=format&fit=crop&q=80&w=800' },
];
