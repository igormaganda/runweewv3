import React from 'react';
import { motion } from 'motion/react';
import { Map, Compass, Mountain, Wind, ArrowRight, Zap, Star } from 'lucide-react';
import { TERRAINS } from '../types/experienceTypes';

export const TrailPage: React.FC = () => {
  const trailTerrains = TERRAINS.filter(t => ['trail', 'mountain', 'forest'].includes(t.id));

  return (
    <div className="min-h-screen bg-white">
      {/* Trail Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-center px-6 bg-brand-navy overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-navy" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-brand-coral font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Outdoor Experience</span>
            <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter italic">
              TRAIL <span className="text-brand-coral">RUNNING</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
              Explorez les sentiers les plus sauvages, des sommets alpins aux forêts mystiques. Découvrez des parcours partagés par la communauté.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trail Categories */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {trailTerrains.map((terrain, i) => (
              <motion.div
                key={terrain.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8">
                  <img src={terrain.image} alt={terrain.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-4xl mb-4 block">{terrain.icon}</span>
                    <h3 className="text-3xl font-display font-black text-white mb-2">{terrain.label}</h3>
                    <p className="text-white/60 text-sm font-medium">Explorer les parcours</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Routes */}
      <section className="py-24 px-6 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="text-5xl font-display font-black tracking-tighter mb-4">Parcours <span className="text-brand-coral italic">Légendaires</span></h2>
              <p className="text-white/40 font-medium">Une sélection de tracés mythiques validés par nos experts et la communauté.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-bold text-brand-coral hover:gap-3 transition-all">
              Tous les parcours <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 flex flex-col md:flex-row gap-8 hover:bg-white/10 transition-all group">
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={`https://picsum.photos/seed/trail${item}/400/400`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-brand-coral rounded-full text-[8px] font-black uppercase tracking-widest">Expert</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                      <Star size={10} className="text-brand-coral" /> 4.9/5
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-black mb-4 group-hover:text-brand-coral transition-colors">
                    {item === 1 ? "La Crête des Cieux" : "Le Sentier de l'Oubli"}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Distance</p>
                      <p className="text-lg font-display font-black">24<span className="text-brand-coral text-[10px] ml-0.5">KM</span></p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Dénivelé</p>
                      <p className="text-lg font-display font-black">1450<span className="text-brand-coral text-[10px] ml-0.5">M</span></p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Difficulté</p>
                      <p className="text-lg font-display font-black">D+</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-coral">
                    Voir le tracé <Map size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trail Gear Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-coral font-bold uppercase tracking-widest text-xs mb-4 block">Équipement</span>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-8">
              L'essentiel pour le <span className="italic text-brand-coral">Dénivelé</span>.
            </h2>
            <p className="text-xl text-brand-navy/60 font-medium mb-12">
              Ne laissez rien au hasard. Découvrez notre sélection de chaussures, sacs d'hydratation et montres GPS testés dans les conditions les plus extrêmes.
            </p>
            <button className="btn-primary px-10 py-5 text-lg flex items-center gap-3">
              Guide d'achat <Zap size={20} />
            </button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-coral rounded-[2rem] p-8 -rotate-6 shadow-2xl flex flex-col justify-between text-white">
              <Star size={32} className="fill-white" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-2">Produit du mois</p>
                <p className="text-2xl font-display font-black">Nike Pegasus Trail 5</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
