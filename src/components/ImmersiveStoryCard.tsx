import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, Zap, MapPin, Wind } from 'lucide-react';
import { EMOTIONS, TERRAINS, AMBIANCES, EmotionType, TerrainType, AmbianceType } from '../types/experienceTypes';

interface ImmersiveStoryCardProps {
  story: {
    id: number;
    title: string;
    excerpt: string;
    image_url: string;
    author_name: string;
    emotion?: EmotionType;
    terrain?: TerrainType;
    ambiance?: AmbianceType;
    intensity?: number;
    likes?: number;
    comments?: number;
    type?: 'user_story' | 'editorial';
  };
  onClick?: () => void;
}

export const ImmersiveStoryCard: React.FC<ImmersiveStoryCardProps> = ({ story, onClick }) => {
  const emotionConfig = EMOTIONS.find(e => e.id === story.emotion);
  const terrainConfig = TERRAINS.find(t => t.id === story.terrain);
  const ambianceConfig = AMBIANCES.find(a => a.id === story.ambiance);

  return (
    <motion.div 
      layout
      onClick={onClick}
      className={`relative rounded-[2.5rem] overflow-hidden bg-white border transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer ${story.type === 'editorial' ? 'border-brand-turquoise/30' : 'border-brand-navy/5 hover:border-brand-coral/20'}`}
    >
      <div className="relative aspect-[4/5]">
        <img 
          src={story.image_url || 'https://picsum.photos/seed/run/800/1000'} 
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
        
        {/* Editorial Badge */}
        {story.type === 'editorial' && (
          <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-brand-turquoise text-white flex items-center gap-2 shadow-lg z-10">
            <Zap size={14} className="fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Éditorial</span>
          </div>
        )}

        {/* Emotion Badge */}
        {emotionConfig && story.type !== 'editorial' && (
          <div className={`absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r ${emotionConfig.color} text-white flex items-center gap-2 shadow-lg ${emotionConfig.animation}`}>
            <span className="text-lg">{emotionConfig.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{emotionConfig.label}</span>
          </div>
        )}

        {/* Intensity Bar */}
        {story.intensity && (
          <div className="absolute top-6 right-6 w-24">
            <div className="flex justify-between text-[8px] font-bold text-white uppercase mb-1 opacity-70">
              <span>Intensité</span>
              <span>{story.intensity}/10</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out" 
                style={{ width: `${story.intensity * 10}%` }} 
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            {terrainConfig && (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-70">
                <MapPin size={12} />
                {terrainConfig.label}
              </div>
            )}
            {ambianceConfig && (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-70">
                <Wind size={12} />
                {ambianceConfig.label}
              </div>
            )}
          </div>

          <h3 className="text-2xl font-display font-black mb-2 leading-tight group-hover:text-brand-coral transition-colors">
            {story.title}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2 font-medium mb-6">
            {story.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-coral/20 flex items-center justify-center text-brand-coral font-black text-[10px]">
                {story.author_name?.[0]}
              </div>
              <span className="text-xs font-bold">{story.author_name}</span>
            </div>
            <div className="flex items-center gap-4 opacity-60">
              <div className="flex items-center gap-1 text-xs">
                <Heart size={14} /> {story.likes || 0}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <MessageCircle size={14} /> {story.comments || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcendence Particles Effect */}
      {story.emotion === 'transcendence' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                y: [-20, -100],
                x: [0, (i % 2 === 0 ? 20 : -20)],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: '20%'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
