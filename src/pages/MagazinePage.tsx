import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, TrendingUp, Clock, Star, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImmersiveStoryCard } from '../components/ImmersiveStoryCard';

export const MagazinePage: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [featuredStory, setFeaturedStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/stories');
        if (res.ok) {
          const data = await res.json();
          setStories(data);
          // Set the first editorial or most recent as featured
          const editorial = data.find((s: any) => s.type === 'editorial');
          setFeaturedStory(editorial || data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const categories = [
    { id: 'all', label: 'Tous les articles', icon: Star },
    { id: 'new', label: 'Nouveautés', icon: Clock },
    { id: 'popular', label: 'Les plus lus', icon: TrendingUp },
    { id: 'editorial', label: 'Éditorial', icon: Zap },
  ];

  const filteredStories = stories.filter(s => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'editorial') return s.type === 'editorial';
    return true; // Simple logic for now
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Magazine Hero */}
      {featuredStory && (
        <section className="relative h-[80vh] w-full overflow-hidden bg-brand-navy">
          <img 
            src={featuredStory.imageUrl || featuredStory.image_url} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt={featuredStory.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20">
            <div className="max-w-5xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-brand-turquoise rounded-full text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                    <Zap size={10} className="fill-white" /> À LA UNE
                  </span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    {featuredStory.type === 'editorial' ? 'Éditorial' : 'Récit Utilisateur'}
                  </span>
                </div>

                <h1 className="text-5xl md:text-8xl font-display font-black text-white leading-[0.85] mb-8 tracking-tighter max-w-4xl">
                  {featuredStory.title}
                </h1>
                
                <p className="text-xl text-white/70 max-w-2xl mb-12 font-medium line-clamp-2">
                  {featuredStory.excerpt || featuredStory.content.substring(0, 150) + '...'}
                </p>

                <button 
                  onClick={() => navigate(`/article/${featuredStory.slug}`)}
                  className="btn-primary flex items-center gap-3 px-10 py-5 text-lg group"
                >
                  Lire l'article <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Magazine Navigation */}
      <nav className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-brand-navy/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                  activeCategory === cat.id ? 'text-brand-coral' : 'text-brand-navy/40 hover:text-brand-navy'
                }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/20" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-brand-navy/5 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-brand-coral/20 transition-all"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Popular Section */}
      <section className="py-24 px-6 bg-brand-navy/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <TrendingUp className="text-brand-coral" size={24} />
            <h2 className="text-3xl font-display font-black tracking-tighter">Les plus <span className="text-brand-coral italic">lus</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {stories.slice(0, 4).map((story, i) => (
              <div 
                key={story.id} 
                className="flex gap-4 group cursor-pointer"
                onClick={() => navigate(`/article/${story.slug}`)}
              >
                <span className="text-4xl font-display font-black text-brand-navy/10 group-hover:text-brand-coral/20 transition-colors">0{i + 1}</span>
                <div>
                  <h3 className="font-bold text-brand-navy mb-2 line-clamp-2 group-hover:text-brand-coral transition-colors">{story.title}</h3>
                  <p className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest">{story.author_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredStories.map((story) => (
              <ImmersiveStoryCard 
                key={story.id} 
                story={story} 
                onClick={() => navigate(`/article/${story.slug || story.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-6 bg-brand-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-coral rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles className="text-brand-coral mx-auto mb-8" size={48} />
          <h2 className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter">
            Ne manquez aucun <span className="italic text-brand-coral">récit</span>.
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Recevez chaque semaine une sélection des meilleurs récits, conseils d'entraînement et actualités trail directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="flex-1 px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-brand-coral transition-all"
            />
            <button className="btn-primary px-10 py-5 text-lg">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
