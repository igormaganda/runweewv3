import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';

interface EditorialCardProps {
  story: {
    id: number;
    title: string;
    content: string;
    image_url: string;
    category?: string;
    created_at: string;
    slug?: string;
  };
  onClick?: () => void;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({ story, onClick }) => {
  return (
    <motion.div 
      layout
      onClick={onClick}
      className="relative rounded-[2rem] overflow-hidden bg-white border-2 border-brand-turquoise/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
    >
      {/* Container flex avec 2 parties */}
      <div className="flex flex-col h-full">
        {/* Partie haute - Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-turquoise/10">
          <img 
            src={story.image_url || 'https://picsum.photos/seed/editorial/800/450'} 
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Badge Éditorial */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-brand-turquoise text-white flex items-center gap-2 shadow-lg z-10">
            <span className="text-[8px] font-black uppercase tracking-widest">Éditorial</span>
          </div>
          
          {/* Badge Catégorie */}
          {story.category && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 text-brand-navy shadow-lg z-10">
              <span className="text-[8px] font-black uppercase tracking-widest">{story.category}</span>
            </div>
          )}
        </div>
        
        {/* Partie basse - Titre et métadonnées */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Date de lecture */}
          <div className="flex items-center gap-2 text-brand-navy/40 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Clock size={12} />
            <span>{new Date(story.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          
          {/* Titre */}
          <h3 className="text-xl font-display font-bold text-brand-navy leading-tight mb-4 line-clamp-2 group-hover:text-brand-coral transition-colors flex-grow">
            {story.title}
          </h3>
          
          {/* Extrait du contenu */}
          <p className="text-sm text-brand-navy/60 line-clamp-2 mb-4 font-medium">
            {story.content.substring(0, 120)}...
          </p>
          
          {/* Call to action */}
          <div className="flex items-center gap-2 text-brand-coral text-xs font-bold uppercase tracking-widest mt-auto">
            <span>Lire l'article</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
