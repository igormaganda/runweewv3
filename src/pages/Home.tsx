import React from 'react';
import { MOCK_STORIES, MOCK_CHALLENGES } from '../constants';
import { RunStoryCard } from '../components/RunStoryCard';
import { ArrowRight, Zap, Trophy, Users, Map, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onStoryClick: (story: RunStory) => void;
}

export const Home: React.FC<Props> = ({ onStoryClick }) => {
  const featuredStory = MOCK_STORIES.find(s => s.isFeatured) || MOCK_STORIES[0];
  const trendingStories = MOCK_STORIES.filter(s => s.isTrending);
  const latestStories = MOCK_STORIES.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-20 overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={featuredStory.imageUrl} 
            className="w-full h-full object-cover"
            alt="Hero Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 bg-brand-coral rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 inline-block">
              Featured Story
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[0.9] mb-8">
              RUN<span className="text-brand-coral">.</span> STORY<span className="text-brand-coral">.</span> <br />
              MAGAZINE<span className="text-brand-coral">.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-lg mb-10 font-light leading-relaxed">
              Transformez vos sorties Strava en récits éditoriaux captivants. 
              L'IA au service de votre passion pour le running.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">
                Publier ma course
              </button>
              <button className="px-6 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                Explorer le magazine
              </button>
            </div>
          </motion.div>
          
          <div className="hidden lg:block cursor-pointer" onClick={() => onStoryClick(featuredStory)}>
            <RunStoryCard story={featuredStory} variant="large" />
          </div>
        </div>
      </section>

      {/* Latest Stories */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label">Latest RunStories</span>
            <h2 className="text-4xl font-display font-black">Dernières publications</h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-brand-coral font-bold hover:gap-3 transition-all">
            Voir tout <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestStories.map(story => (
            <div key={story.id} onClick={() => onStoryClick(story)} className="cursor-pointer">
              <RunStoryCard story={story} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 px-6 bg-brand-sky">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <span className="section-label">Trending Runs</span>
            <h2 className="text-4xl font-display font-black mb-12">Les récits du moment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {MOCK_STORIES.slice(0, 4).map(story => (
                <div key={story.id} onClick={() => onStoryClick(story)} className="cursor-pointer">
                  <RunStoryCard story={story} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-display font-black mb-8 pb-4 border-b border-brand-navy/10">Populaires cette semaine</h3>
              <div className="space-y-8">
                {MOCK_STORIES.map(story => (
                  <div key={story.id} onClick={() => onStoryClick(story)} className="cursor-pointer">
                    <RunStoryCard story={story} variant="horizontal" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-brand-navy rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <Trophy className="text-brand-yellow mb-4" size={32} />
                <h4 className="text-xl font-display font-bold mb-2">Runner of the Week</h4>
                <p className="text-white/60 text-sm mb-6">Julie Martin a parcouru 120km cette semaine avec 3 récits passionnants.</p>
                <button className="text-brand-yellow font-bold text-sm flex items-center gap-2">
                  Voir son profil <ArrowRight size={16} />
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-coral/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trail Section */}
      <section className="py-24 px-6 bg-brand-mint">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="section-label !text-brand-turquoise">Trail Adventures</span>
              <h2 className="text-4xl font-display font-black">L'appel de la nature</h2>
            </div>
            <p className="text-brand-navy/60 max-w-md">
              Des sommets enneigés aux sentiers forestiers, découvrez les aventures les plus sauvages de notre communauté.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_STORIES.filter(s => s.category === 'Trail').concat(MOCK_STORIES[0]).slice(0, 2).map(story => (
              <div key={story.id} onClick={() => onStoryClick(story)} className="cursor-pointer">
                <RunStoryCard story={story} variant="large" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Challenges */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Community Highlights</span>
              <h2 className="text-4xl font-display font-black mb-8">Rejoignez le peloton</h2>
              <div className="space-y-6">
                {[
                  { icon: Users, title: "Clubs de running", desc: "Connectez-vous avec des coureurs locaux." },
                  { icon: Trophy, title: "Défis mensuels", desc: "Repoussez vos limites et gagnez des badges." },
                  { icon: Map, title: "Destinations", desc: "Découvrez les meilleurs spots partout dans le monde." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-brand-navy/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-lg bg-brand-coral/10 flex items-center justify-center text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-all">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-brand-navy/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-navy/5">
                <img src={MOCK_CHALLENGES[0].imageUrl} className="w-full h-64 object-cover" alt="Challenge" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-display font-black">{MOCK_CHALLENGES[0].title}</h3>
                    <span className="px-3 py-1 bg-brand-yellow/20 text-brand-yellow text-[10px] font-bold rounded-full uppercase">Active</span>
                  </div>
                  <p className="text-brand-navy/60 mb-8">{MOCK_CHALLENGES[0].description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-brand-navy text-[10px] flex items-center justify-center text-white border-2 border-white">
                        +{MOCK_CHALLENGES[0].participantsCount}
                      </div>
                    </div>
                    <button className="btn-primary !py-2 !px-6 text-sm">Rejoindre</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publish CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto w-full bg-gradient-to-br from-brand-coral via-brand-coral to-brand-yellow rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Zap className="mx-auto mb-8 text-white animate-pulse" size={48} />
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
              VOTRE COURSE MÉRITE UNE HISTOIRE.
            </h2>
            <p className="text-xl text-white/80 mb-12 font-light">
              Connectez votre compte Strava ou Garmin et laissez notre IA transformer vos données en un article de magazine professionnel.
            </p>
            <button className="px-10 py-5 bg-white text-brand-coral font-black text-xl rounded-full hover:scale-105 transition-transform shadow-2xl">
              Publier mon RunStory
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-brand-peach">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="mx-auto mb-6 text-brand-coral" size={32} />
          <h2 className="text-3xl font-display font-black mb-4">The Weekly Pace</h2>
          <p className="text-brand-navy/60 mb-10">Recevez chaque dimanche les meilleures histoires, conseils d'entraînement et actualités matos directement dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="flex-1 px-6 py-4 rounded-full border border-brand-navy/10 focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white"
            />
            <button className="btn-primary whitespace-nowrap">S'abonner</button>
          </form>
        </div>
      </section>
    </div>
  );
};

import { RunStory } from '../types';
