import React from 'react';
import { RunStory } from '../types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  story: RunStory;
  variant?: 'large' | 'compact' | 'horizontal';
}

export const RunStoryCard: React.FC<Props> = ({ story, variant = 'compact' }) => {
  if (variant === 'horizontal') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex gap-6 group cursor-pointer"
      >
        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <img 
            src={story.imageUrl} 
            alt={story.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-coral mb-1">
            {story.category}
          </span>
          <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-brand-coral transition-colors">
            {story.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-brand-navy/50">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {story.date}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="article-card group bg-white border border-brand-navy/5 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative overflow-hidden ${variant === 'large' ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        <img 
          src={story.imageUrl} 
          alt={story.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-navy shadow-sm">
            {story.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={story.author.avatar} alt={story.author.name} className="w-6 h-6 rounded-full" />
          <span className="text-xs font-medium text-brand-navy/60">{story.author.name}</span>
        </div>
        
        <h3 className={`font-display font-bold mb-3 group-hover:text-brand-coral transition-colors ${variant === 'large' ? 'text-3xl' : 'text-xl'}`}>
          {story.title}
        </h3>
        
        <p className="text-brand-navy/60 text-sm line-clamp-2 mb-6">
          {story.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5">
          <div className="flex gap-4 text-[10px] font-bold text-brand-navy/40 uppercase tracking-tighter">
            <span className="flex items-center gap-1"><MapPin size={12} /> {story.runData.distance}km</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {story.runData.pace}/km</span>
          </div>
          <button className="text-brand-coral hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
