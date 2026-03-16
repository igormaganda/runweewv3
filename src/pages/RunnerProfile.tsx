import React from 'react';
import { Runner, RunStory } from '../types';
import { MOCK_STORIES } from '../constants';
import { RunStoryCard } from '../components/RunStoryCard';
import { MapPin, Calendar, Award, Settings, Grid, List } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  runner: Runner;
  onStoryClick: (story: RunStory) => void;
}

export const RunnerProfile: React.FC<Props> = ({ runner, onStoryClick }) => {
  const runnerStories = MOCK_STORIES.filter(s => s.author.id === runner.id);

  return (
    <div className="min-h-screen bg-brand-sky/30">
      {/* Profile Header */}
      <div className="bg-white border-b border-brand-navy/5 pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <div className="relative">
              <img src={runner.avatar} alt={runner.name} className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-navy shadow-lg">
                <Award size={20} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl font-display font-black mb-2">{runner.name}</h1>
                  <p className="text-brand-navy/50 flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={16} /> Lyon, France • Membre depuis 2024
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary !py-2 !px-6 text-sm">Suivre</button>
                  <button className="p-2 border border-brand-navy/10 rounded-full hover:bg-brand-navy/5 transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
              
              <p className="text-brand-navy/70 max-w-2xl mb-8 leading-relaxed">
                {runner.bio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Distance Totale</p>
                  <p className="text-2xl font-display font-black text-brand-coral">{runner.stats.totalDistance} <span className="text-sm font-normal text-brand-navy/40">km</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Articles</p>
                  <p className="text-2xl font-display font-black text-brand-coral">{runner.stats.storiesPublished}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Abonnés</p>
                  <p className="text-2xl font-display font-black text-brand-coral">1.2k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-8 border-b border-brand-navy/5 w-full">
            <button className="pb-4 border-b-2 border-brand-coral font-bold text-sm">RunStories</button>
            <button className="pb-4 text-brand-navy/40 font-bold text-sm hover:text-brand-navy transition-colors">Statistiques</button>
            <button className="pb-4 text-brand-navy/40 font-bold text-sm hover:text-brand-navy transition-colors">Badges</button>
          </div>
          <div className="flex gap-2 ml-4">
            <button className="p-2 bg-white rounded-lg shadow-sm text-brand-coral"><Grid size={18} /></button>
            <button className="p-2 text-brand-navy/30"><List size={18} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {runnerStories.map(story => (
            <div key={story.id} onClick={() => onStoryClick(story)} className="cursor-pointer">
              <RunStoryCard story={story} />
            </div>
          ))}
          {runnerStories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-brand-navy/10">
              <p className="text-brand-navy/40">Aucun article publié pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
