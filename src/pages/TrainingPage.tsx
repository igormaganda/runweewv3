import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, Activity, Brain, ArrowRight, CheckCircle, Play, Star } from 'lucide-react';

export const TrainingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Training Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-center px-6 bg-brand-navy overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920)',
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="text-brand-coral" size={20} />
              <span className="text-brand-coral font-bold uppercase tracking-[0.4em] text-xs">Performance Engine</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter">
              ENTRAÎNEZ <span className="text-brand-coral italic">VOUS</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
              Optimisez chaque foulée avec nos plans d'entraînement intelligents, nos conseils nutritionnels et nos analyses de performance basées sur l'IA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Training Pillars */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Plans sur mesure", icon: Target, desc: "Du 5km à l'Ultra-Trail, des programmes adaptés à votre niveau et vos objectifs." },
              { title: "Analyse IA", icon: Brain, desc: "Vos données Garmin/Strava analysées pour prévenir les blessures et optimiser la charge." },
              { title: "Force & Mobilité", icon: Activity, desc: "Des séances de renforcement spécifiques pour devenir un coureur plus robuste." }
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] bg-brand-navy/5 border border-brand-navy/5 hover:border-brand-coral/20 transition-all group"
              >
                <div className="w-16 h-16 bg-brand-coral/10 rounded-2xl flex items-center justify-center text-brand-coral mb-8 group-hover:scale-110 transition-transform">
                  <pillar.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-black mb-4">{pillar.title}</h3>
                <p className="text-brand-navy/60 font-medium leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Training Plan */}
      <section className="py-24 px-6 bg-brand-navy text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-coral rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="text-brand-coral font-bold uppercase tracking-widest text-xs mb-4 block">Programme Vedette</span>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-8">
              Objectif <span className="italic text-brand-coral">Marathon</span>.
            </h2>
            <p className="text-xl text-white/60 font-medium mb-12">
              12 semaines pour franchir la ligne d'arrivée avec le sourire. Un plan progressif incluant fractionné, sorties longues et récupération active.
            </p>
            <div className="space-y-4 mb-12">
              {["Planification dynamique", "Conseils nutritionnels J-7", "Séances de PPG incluses", "Support communauté"].map(item => (
                <div key={item} className="flex items-center gap-3 text-white/80 font-bold">
                  <CheckCircle size={20} className="text-brand-coral" />
                  {item}
                </div>
              ))}
            </div>
            <button className="btn-primary px-10 py-5 text-lg flex items-center gap-3">
              Démarrer le plan <Play size={20} fill="currentColor" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
              </div>
              <div className="bg-brand-coral p-8 rounded-3xl">
                <p className="text-4xl font-display font-black">12</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Semaines</p>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                <Star size={32} className="text-brand-coral mb-4 fill-brand-coral" />
                <p className="text-sm font-bold leading-relaxed italic">"Ce plan a changé ma vision de la préparation. J'ai battu mon record de 15 minutes !"</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-40">— Thomas, Marathon de Paris</p>
              </div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-12">
            <Brain size={48} className="text-brand-coral" />
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-8">
            Votre Coach <span className="italic text-brand-coral">Personnel</span>.
          </h2>
          <p className="text-xl text-brand-navy/60 font-medium mb-12">
            Posez vos questions à notre IA spécialisée en physiologie du sport. Analyse de séance, gestion de fatigue ou choix d'équipement : obtenez des réponses instantanées et précises.
          </p>
          <button className="px-12 py-6 bg-brand-navy text-white rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl flex items-center gap-3 mx-auto">
            Discuter avec le Coach <Zap size={24} />
          </button>
        </div>
      </section>
    </div>
  );
};
