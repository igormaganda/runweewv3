import React from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, Trophy, Heart, ArrowRight, PlusCircle, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Community Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-6 bg-brand-navy overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1530549387631-6c12961b3906?auto=format&fit=crop&q=80&w=1920)',
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
              <Users className="text-brand-coral" size={20} />
              <span className="text-brand-coral font-bold uppercase tracking-[0.4em] text-xs">RunWeek Tribe</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter">
              LA <span className="text-brand-coral italic">COMMUNAUTÉ</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
              Rejoignez des milliers de passionnés. Partagez vos exploits, participez à des challenges et trouvez vos futurs partenaires de course.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Membres actifs", value: "12.4K", icon: Users },
            { label: "Récits partagés", value: "45K+", icon: MessageSquare },
            { label: "Dénivelé total", value: "2.1M", icon: Trophy },
            { label: "Kudos donnés", value: "890K", icon: Heart }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-coral">
                <stat.icon size={24} />
              </div>
              <p className="text-4xl font-display font-black text-brand-navy mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24 px-6 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="text-5xl font-display font-black tracking-tighter mb-4">Challenges du <span className="text-brand-coral italic">Mois</span></h2>
              <p className="text-white/40 font-medium">Relevez le défi et gagnez des badges exclusifs pour votre profil.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-bold text-brand-coral hover:gap-3 transition-all">
              Tous les challenges <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Vertical Rush", desc: "Grimpez 2000m de D+ en 30 jours.", participants: 1240, reward: "Badge Grimpeur" },
              { title: "Early Bird", desc: "Réalisez 5 runs avant 7h du matin.", participants: 850, reward: "Badge Aurore" }
            ].map((challenge) => (
              <div key={challenge.title} className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-brand-coral rounded-full text-[8px] font-black uppercase tracking-widest">Actif</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{challenge.participants} participants</span>
                  </div>
                  <h3 className="text-3xl font-display font-black mb-4 group-hover:text-brand-coral transition-colors">{challenge.title}</h3>
                  <p className="text-white/60 font-medium mb-8 max-w-sm">{challenge.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-brand-coral fill-brand-coral" />
                      <span className="text-xs font-bold">{challenge.reward}</span>
                    </div>
                    <button className="px-6 py-3 bg-white text-brand-navy rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-coral hover:text-white transition-all">
                      Rejoindre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Feed Preview */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-8">
              Dernières <span className="italic text-brand-coral">Activités</span>.
            </h2>
            <p className="text-xl text-brand-navy/60 font-medium max-w-2xl mx-auto">
              Inspirez-vous des sorties de la communauté et interagissez avec les autres coureurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-brand-navy/5 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-navy/5 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} alt="Avatar" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Runner_{i}42</p>
                    <p className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                  <img src={`https://picsum.photos/seed/run${i}/600/400`} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-display font-black mb-2">Sortie matinale sous la pluie</h4>
                <p className="text-sm text-brand-navy/60 line-clamp-2 mb-6">Rien de tel que l'odeur de la terre mouillée pour se sentir vivant...</p>
                <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs font-bold text-brand-navy/40 hover:text-brand-coral transition-colors">
                      <Heart size={16} /> 24
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold text-brand-navy/40 hover:text-brand-coral transition-colors">
                      <MessageSquare size={16} /> 5
                    </button>
                  </div>
                  <Zap size={16} className="text-brand-coral" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/generator" className="inline-flex items-center gap-3 px-12 py-6 bg-brand-navy text-white rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
              Partager mon run <PlusCircle size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
