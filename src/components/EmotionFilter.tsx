import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EMOTIONS, AMBIANCES, TERRAINS, EmotionType, AmbianceType, TerrainType } from '../types/experienceTypes';

interface EmotionFilterProps {
  onFilterChange: (type: 'emotion' | 'ambiance' | 'terrain', value: string | null) => void;
}

export const EmotionFilter: React.FC<EmotionFilterProps> = ({ onFilterChange }) => {
  const [activeTab, setActiveTab] = useState<'emotion' | 'ambiance' | 'terrain'>('emotion');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    const newValue = selectedValue === value ? null : value;
    setSelectedValue(newValue);
    onFilterChange(activeTab, newValue);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16">
      <div className="flex justify-center gap-8 mb-12">
        {['emotion', 'ambiance', 'terrain'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setSelectedValue(null);
              onFilterChange(tab as any, null);
            }}
            className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${
              activeTab === tab ? 'border-brand-coral text-brand-navy' : 'border-transparent text-brand-navy/30'
            }`}
          >
            {tab === 'emotion' ? 'Émotions' : tab === 'ambiance' ? 'Ambiances' : 'Terrains'}
          </button>
        ))}
      </div>

      <div className="min-h-[120px]">
        {activeTab === 'emotion' && (
          <div className="flex flex-wrap justify-center gap-6">
            {EMOTIONS.map((emotion) => (
              <motion.button
                key={emotion.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(emotion.id)}
                className={`flex flex-col items-center gap-3 transition-all ${
                  selectedValue && selectedValue !== emotion.id ? 'opacity-30 grayscale' : 'opacity-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${emotion.color} flex items-center justify-center text-2xl shadow-lg ${
                  selectedValue === emotion.id ? emotion.animation : ''
                }`}>
                  {emotion.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{emotion.label}</span>
              </motion.button>
            ))}
          </div>
        )}

        {activeTab === 'ambiance' && (
          <div className="flex flex-wrap justify-center gap-4">
            {AMBIANCES.map((ambiance) => (
              <button
                key={ambiance.id}
                onClick={() => handleSelect(ambiance.id)}
                className={`px-6 py-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  selectedValue === ambiance.id 
                    ? 'bg-brand-navy text-white border-brand-navy' 
                    : 'bg-white text-brand-navy border-brand-navy/5 hover:border-brand-coral/30'
                } ${selectedValue && selectedValue !== ambiance.id ? 'opacity-30' : 'opacity-100'}`}
              >
                <span className="text-xl">{ambiance.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-bold">{ambiance.label}</div>
                  <div className="text-[8px] opacity-50 uppercase tracking-widest">{ambiance.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'terrain' && (
          <div className="flex flex-wrap justify-center gap-4">
            {TERRAINS.map((terrain) => (
              <button
                key={terrain.id}
                onClick={() => handleSelect(terrain.id)}
                className={`group relative w-32 h-32 rounded-2xl overflow-hidden transition-all ${
                  selectedValue && selectedValue !== terrain.id ? 'opacity-30 grayscale' : 'opacity-100'
                } ${selectedValue === terrain.id ? 'ring-4 ring-brand-coral ring-offset-2' : ''}`}
              >
                <img src={terrain.image} alt={terrain.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <span className="text-2xl mb-1">{terrain.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{terrain.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
