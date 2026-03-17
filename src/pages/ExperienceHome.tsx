import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, Zap, Wind, Map as MapIcon, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EmotionFilter } from '../components/EmotionFilter';
import { ImmersiveStoryCard } from '../components/ImmersiveStoryCard';
import { EMOTIONS, AMBIANCES, TERRAINS, EmotionType, AmbianceType, TerrainType } from '../types/experienceTypes';

export const ExperienceHome: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [filteredStories, setFilteredStories] = useState<any[]>([]);
  const [editorialStories, setEditorialStories] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<{
    emotion: string | null;
    ambiance: string | null;
    terrain: string | null;
  }>({ emotion: null, ambiance: null, terrain: null });

  const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1461896756985-2346a8b33839?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1513594422441-24035dd0411a?auto=format&fit=crop&q=80&w=1920'
  ];

  useEffect(() => {
    // Select a random hero image on mount
    const randomIndex = Math.floor(Math.random() * HERO_IMAGES.length);
    setHeroImage(HERO_IMAGES[randomIndex]);

    const fetchData = async () => {
      try {
        const [storiesRes, editorialRes, adsRes] = await Promise.all([
          fetch('/api/stories'),
          fetch('/api/stories?type=editorial'),
          fetch('/api/ads')
        ]);

        if (storiesRes.ok) {
          const data = await storiesRes.json();
          const enrichedData = data.map((s: any, i: number) => ({
            ...s,
            emotion: s.emotion || EMOTIONS[i % EMOTIONS.length].id,
            terrain: s.terrain || TERRAINS[i % TERRAINS.length].id,
            ambiance: s.ambiance || AMBIANCES[i % AMBIANCES.length].id,
            intensity: s.intensity || Math.floor(Math.random() * 5) + 5,
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20)
          }));
          setStories(enrichedData);
          setFilteredStories(enrichedData);
        }

        if (editorialRes.ok) {
          setEditorialStories(await editorialRes.json());
        }

        if (adsRes.ok) {
          setAds(await adsRes.json());
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (type: 'emotion' | 'ambiance' | 'terrain', value: string | null) => {
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);

    let result = [...stories];
    if (newFilters.emotion) result = result.filter(s => s.emotion === newFilters.emotion);
    if (newFilters.ambiance) result = result.filter(s => s.ambiance === newFilters.ambiance);
    if (newFilters.terrain) result = result.filter(s => s.terrain === newFilters.terrain);
    
    setFilteredStories(result);
  };

  const activeEmotion = EMOTIONS.find(e => e.id === activeFilters.emotion);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-brand-navy">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeFilters.emotion ? 0.2 : 0.4
          }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilters.emotion || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 opacity-40 z-1"
            style={{
              background: activeEmotion?.color 
                ? `radial-gradient(circle at 50% 50%, var(--tw-gradient-from) 0%, transparent 70%)`
                : 'radial-gradient(circle at 50% 50%, #FF5733 0%, transparent 70%)'
            }}
          />
        </AnimatePresence>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <Sparkles className="text-brand-coral" size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60">L'Expérience Émotionnelle</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black text-white mb-4 leading-[0.9] tracking-tighter"
          >
            {activeEmotion ? (
              <>Vivez le <span className="italic text-brand-coral">{activeEmotion.label}</span></>
            ) : (
              <>Courez. Ressentez. <span className="italic text-brand-coral">Racontez.</span></>
            )}
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-medium mb-6 max-w-2xl mx-auto"
          >
            {activeEmotion ? activeEmotion.description : "Découvrez les récits de course à travers le prisme des émotions, des paysages et des atmosphères."}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/generator" className="btn-primary flex items-center gap-2 px-10 py-5 text-lg">
              Créer mon RunStory <Zap size={20} />
            </Link>
            <button className="px-10 py-5 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              Regarder le Manifeste <Play size={20} fill="currentColor" />
            </button>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                y: [0, -1000],
                x: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%'
              }}
            />
          ))}
        </div>
      </section>

      {/* Ad Zone: Home Top */}
      {ads.filter(ad => ad.position === 'home_top').map(ad => (
        <div key={ad.id} className="max-w-7xl mx-auto px-6 py-8">
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-2xl">
            <img src={ad.image_url} alt={ad.title} className="w-full h-auto max-h-[150px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors" />
            <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-brand-navy/40">Sponsorisé</span>
          </a>
        </div>
      ))}

      {/* Filter Section */}
      <section className="py-12 px-6 bg-brand-navy/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-brand-navy/40 font-bold uppercase tracking-widest text-xs mb-6 block">Exploration</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4 tracking-tighter">Trouvez votre <span className="italic text-brand-coral">inspiration</span></h2>
          </div>
          <EmotionFilter onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Editorial Section */}
      {editorialStories.length > 0 && (
        <section className="py-12 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-display font-black tracking-tighter">Le <span className="text-brand-coral italic">Magazine</span></h2>
                <p className="text-brand-navy/40 font-bold uppercase tracking-widest text-xs mt-2">Articles exclusifs par notre rédaction</p>
              </div>
              <Link to="/" className="text-brand-navy font-bold flex items-center gap-2 group">
                Tout lire <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {editorialStories.slice(0, 2).map((story, i) => (
                <motion.div 
                  key={story.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/article/${story.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-6">
                    <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-brand-coral text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Éditorial
                      </span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-display font-black mb-4 group-hover:text-brand-coral transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-brand-navy/60 line-clamp-2 mb-6 font-medium">
                    {story.content.substring(0, 180)}...
                  </p>
                  <div className="flex items-center gap-4">
                    <img src={story.author.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-brand-navy/5" />
                    <div>
                      <div className="text-sm font-black text-brand-navy">{story.author.name}</div>
                      <div className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-wider">Rédaction RunWeek</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Zone: Home Middle */}
      {ads.filter(ad => ad.position === 'home_middle').map(ad => (
        <div key={ad.id} className="max-w-7xl mx-auto px-6 py-8">
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-2xl">
            <img src={ad.image_url} alt={ad.title} className="w-full h-auto max-h-[150px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors" />
            <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-brand-navy/40">Sponsorisé</span>
          </a>
        </div>
      ))}

      {/* Stories Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-black">Récits Immersifs</h2>
              <p className="text-brand-navy/40 font-bold uppercase tracking-widest text-[10px] mt-1">
                {filteredStories.length} histoires trouvées
              </p>
            </div>
            <div className="flex gap-2">
              {Object.entries(activeFilters).map(([key, value]) => value && (
                <button 
                  key={key}
                  onClick={() => handleFilterChange(key as any, null)}
                  className="px-3 py-1.5 bg-brand-navy text-white text-[10px] font-bold rounded-full flex items-center gap-2"
                >
                  {value} <Zap size={10} />
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-brand-navy/5 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => (
                <ImmersiveStoryCard 
                  key={story.id} 
                  story={story} 
                  onClick={() => navigate(`/article/${story.slug || story.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wind size={32} className="text-brand-navy/20" />
              </div>
              <h3 className="text-2xl font-display font-black mb-2">Aucun récit trouvé</h3>
              <p className="text-brand-navy/40 font-medium">Essayez de modifier vos filtres pour explorer d'autres horizons.</p>
            </div>
          )}
        </div>
      </section>

      {/* Terrain Showcase */}
      <section className="py-12 px-6 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-8">
            <div className="max-w-xl">
              <span className="text-brand-coral font-bold uppercase tracking-widest text-xs mb-4 block">Destinations</span>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter">
                Explorez par <span className="italic text-brand-coral">Terrain</span>
              </h2>
            </div>
            <button className="flex items-center gap-2 font-bold text-white/60 hover:text-white transition-colors">
              Voir tous les terrains <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TERRAINS.slice(0, 4).map((terrain) => (
              <div 
                key={terrain.id} 
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer"
                onClick={() => handleFilterChange('terrain', terrain.id)}
              >
                <img src={terrain.image} alt={terrain.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-4xl mb-4">{terrain.icon}</span>
                  <h3 className="text-2xl font-display font-black mb-2">{terrain.label}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    Découvrir les récits <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-brand-coral rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter">
              Chaque course est une <span className="italic text-brand-navy">histoire</span>.
            </h2>
            <p className="text-xl font-medium mb-12 opacity-80 max-w-2xl mx-auto">
              Ne laissez pas vos émotions s'envoler. Transformez votre dernier run en un article de magazine immersif.
            </p>
            <Link to="/generator" className="inline-flex items-center gap-3 px-12 py-6 bg-brand-navy text-white rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
              Commencer mon récit <Zap size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
