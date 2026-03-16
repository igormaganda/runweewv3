import React from 'react';
import { RunStory } from '../types';
import { Calendar, Clock, MapPin, Share2, Heart, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  story: RunStory;
  onBack: () => void;
}

export const ArticlePage: React.FC<Props> = ({ story, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      {/* Article Hero */}
      <header className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={story.imageUrl} 
          alt={story.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} /> Retour au magazine
            </button>
            <span className="px-4 py-1.5 bg-brand-coral rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 inline-block">
              {story.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight italic mb-8">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <img src={story.author.avatar} alt={story.author.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                <div>
                  <p className="text-sm font-bold text-white">{story.author.name}</p>
                  <p className="text-[10px] uppercase tracking-wider">{story.date}</p>
                </div>
              </div>
              
              <div className="flex gap-6 border-l border-white/20 pl-8">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">Distance</p>
                  <p className="text-xl font-display font-bold">{story.runData.distance}km</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">Allure</p>
                  <p className="text-xl font-display font-bold">{story.runData.pace}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">D+</p>
                  <p className="text-xl font-display font-bold">{story.runData.elevation}m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-3">
          <p className="text-2xl text-brand-navy/70 font-light mb-12 italic leading-relaxed border-l-4 border-brand-coral pl-8">
            {story.excerpt}
          </p>
          
          <div className="prose prose-lg prose-brand max-w-none text-brand-navy/80 leading-relaxed space-y-8">
            <p>
              C'était l'un de ces matins où le réveil semble plus lourd que d'habitude. Mais dès les premières foulées, l'air frais a balayé les doutes. Le parcours, soigneusement choisi la veille, promettait un défi à la hauteur de mes ambitions du moment.
            </p>
            <p>
              Le rythme s'est installé naturellement. 4:45, 4:40, 4:38... Les kilomètres défilaient sous mes pieds avec une régularité métronomique. C'est dans ces moments de "flow" que le running prend tout son sens. On ne court plus seulement avec ses jambes, mais avec tout son être, en parfaite harmonie avec l'environnement.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop" 
              className="w-full rounded-3xl shadow-xl my-12" 
              alt="Run context" 
              referrerPolicy="no-referrer"
            />
            <p>
              Le passage au 30ème kilomètre a été le véritable test. La fatigue commençait à se faire sentir, mais le mental a pris le relais. Chaque montée était une opportunité de tester ma résilience, chaque descente un moment de récupération active.
            </p>
            <p>
              En franchissant la ligne d'arrivée imaginaire de cette sortie longue, la satisfaction était totale. Plus qu'une simple ligne sur Strava, c'était une victoire personnelle, un récit écrit à la sueur et à la détermination.
            </p>
          </div>
          
          <div className="mt-20 pt-10 border-t border-brand-navy/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-coral transition-colors">
                <Heart size={24} /> <span>124</span>
              </button>
              <button className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-coral transition-colors">
                <MessageSquare size={24} /> <span>18</span>
              </button>
            </div>
            <button className="p-3 bg-brand-navy/5 rounded-full hover:bg-brand-coral hover:text-white transition-all">
              <Share2 size={24} />
            </button>
          </div>
        </div>
        
        <aside className="lg:col-span-1 space-y-12">
          <div className="bg-brand-sky p-8 rounded-3xl sticky top-32">
            <h4 className="font-display font-black mb-6 flex items-center gap-2">
              <Zap className="text-brand-coral" size={20} /> Training Insight
            </h4>
            <p className="text-sm text-brand-navy/70 italic leading-relaxed mb-6">
              "Votre gestion de l'allure sur la seconde moitié du parcours montre une excellente endurance aérobie. Continuez à intégrer ces sorties longues pour solidifier votre base avant votre prochain objectif."
            </p>
            <div className="h-2 w-full bg-brand-navy/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-turquoise w-[85%]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-brand-turquoise">Endurance Score: 85%</p>
          </div>
          
          <div>
            <h4 className="font-display font-bold mb-6 text-sm uppercase tracking-widest text-brand-navy/40">À propos de l'auteur</h4>
            <div className="flex items-center gap-4 mb-4">
              <img src={story.author.avatar} alt={story.author.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold">{story.author.name}</p>
                <p className="text-xs text-brand-navy/50">{story.author.stats.totalDistance}km parcourus</p>
              </div>
            </div>
            <p className="text-xs text-brand-navy/60 leading-relaxed">
              {story.author.bio}
            </p>
            <button className="w-full mt-6 py-3 border border-brand-navy/10 rounded-xl text-xs font-bold hover:bg-brand-navy hover:text-white transition-all">
              Suivre le coureur
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

import { Zap } from 'lucide-react';
