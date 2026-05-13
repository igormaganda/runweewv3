import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, TrendingUp, Clock, Star, Filter, Search, ChevronDown, X, Mountain, Flame, Sun, MapPin, Cloud, CloudRain, Snowflake, Trees, Waves, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImmersiveStoryCard } from '../components/ImmersiveStoryCard';
import { EditorialCard } from '../components/EditorialCard';

// Filter options based on story schema
const EMOTION_OPTIONS = [
  { id: 'all', label: 'Tous', icon: Star },
  { id: 'flow', label: 'Flow', icon: Flame },
  { id: 'determination', label: 'Détermination', icon: Mountain },
  { id: 'joy', label: 'Joie', icon: Sparkles },
  { id: 'serenity', label: 'Sérénité', icon: Sun },
];

const ATMOSPHERE_OPTIONS = [
  { id: 'all', label: 'Toutes', icon: Star },
  { id: 'clair', label: 'Clair', icon: Sun },
  { id: 'brumeux', label: 'Brumeux', icon: Cloud },
  { id: 'pluvieux', label: 'Pluvieux', icon: CloudRain },
  { id: 'neigeux', label: 'Neigeux', icon: Snowflake },
];

const TERRAIN_OPTIONS = [
  { id: 'all', label: 'Tous', icon: Star },
  { id: 'ville', label: 'Ville', icon: MapPin },
  { id: 'montagne', label: 'Montagne', icon: Mountain },
  { id: 'foret', label: 'Forêt', icon: Trees },
  { id: 'bord_de_mer', label: 'Bord de mer', icon: Waves },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Plus récent', icon: Clock },
  { id: 'popular', label: 'Plus populaire', icon: TrendingUp },
  { id: 'oldest', label: 'Plus ancien', icon: History },
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Tous les articles', icon: Star },
  { id: 'new', label: 'Nouveautés', icon: Sparkles },
  { id: 'popular', label: 'Les plus lus', icon: TrendingUp },
  { id: 'editorial', label: 'Éditorial', icon: Zap },
  { id: 'course', label: 'Course', icon: Flame },
  { id: 'trail', label: 'Trail', icon: Mountain },
];

export const MagazinePage: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [featuredStory, setFeaturedStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedAtmosphere, setSelectedAtmosphere] = useState('all');
  const [selectedTerrain, setSelectedTerrain] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // UI states - filters shown by default
  const [showFilters, setShowFilters] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/stories');
        if (res.ok) {
          const data = await res.json();
          setStories(data);
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

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    if (selectedEmotion !== 'all') count++;
    if (selectedAtmosphere !== 'all') count++;
    if (selectedTerrain !== 'all') count++;
    if (searchQuery.trim()) count++;
    setActiveFilterCount(count);
  }, [selectedEmotion, selectedAtmosphere, selectedTerrain, searchQuery]);

  // Filter and sort stories
  const filteredAndSortedStories = useMemo(() => {
    let filtered = [...stories];

    // Category filter
    if (activeCategory === 'editorial') {
      filtered = filtered.filter(s => s.type === 'editorial');
    } else if (activeCategory === 'course') {
      filtered = filtered.filter(s => s.category === 'Course');
    } else if (activeCategory === 'trail') {
      filtered = filtered.filter(s => s.category === 'Trail');
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.title?.toLowerCase().includes(query) ||
        s.content?.toLowerCase().includes(query) ||
        s.author_name?.toLowerCase().includes(query)
      );
    }

    // Emotion filter
    if (selectedEmotion !== 'all') {
      filtered = filtered.filter(s => s.primary_emotion === selectedEmotion);
    }

    // Atmosphere filter
    if (selectedAtmosphere !== 'all') {
      filtered = filtered.filter(s => s.atmosphere === selectedAtmosphere);
    }

    // Terrain filter
    if (selectedTerrain !== 'all') {
      filtered = filtered.filter(s => s.terrain === selectedTerrain);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    return filtered;
  }, [stories, activeCategory, searchQuery, selectedEmotion, selectedAtmosphere, selectedTerrain, sortBy]);

  // Get featured editorials
  const featuredEditorials = useMemo(() => {
    return stories.filter((s: any) => s.type === 'editorial').slice(0, 2);
  }, [stories]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedEmotion('all');
    setSelectedAtmosphere('all');
    setSelectedTerrain('all');
    setSearchQuery('');
  };

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
                  {featuredStory.excerpt || featuredStory.content?.substring(0, 150) + '...'}
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

      {/* Magazine Navigation with Filters */}
      <nav className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-brand-navy/5">
        {/* Main Category Tabs */}
        <div className="px-6 py-4 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <div className="flex items-center gap-6 min-w-max">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'text-brand-coral' : 'text-brand-navy/40 hover:text-brand-navy'}`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 min-w-max">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-48 pl-9 pr-8 py-2 bg-brand-navy/5 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-brand-coral/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${showFilters || activeFilterCount > 0 ? 'bg-brand-coral text-white' : 'bg-brand-navy/5 text-brand-navy/70 hover:bg-brand-navy/10'}`}
              >
                <Filter size={14} />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-yellow text-brand-navy rounded-full text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel - shown by default */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-brand-navy/10 bg-brand-navy/[0.02]"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-navy/60">Filtres avancés</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-brand-coral hover:text-brand-coral/80 transition-colors"
                  >
                    Réinitialiser tout
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Emotion Filter */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-3 block">
                    Émotion
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedEmotion(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedEmotion === opt.id ? 'bg-brand-coral text-white' : 'bg-white border border-brand-navy/10 text-brand-navy/60 hover:border-brand-coral/30'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Atmosphere Filter */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-3 block">
                    Atmosphère
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ATMOSPHERE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAtmosphere(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedAtmosphere === opt.id ? 'bg-brand-coral text-white' : 'bg-white border border-brand-navy/10 text-brand-navy/60 hover:border-brand-coral/30'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terrain Filter */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-3 block">
                    Terrain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TERRAIN_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedTerrain(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTerrain === opt.id ? 'bg-brand-coral text-white' : 'bg-white border border-brand-navy/10 text-brand-navy/60 hover:border-brand-coral/30'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Results Summary */}
      <section className="px-6 py-4 bg-brand-navy/[0.02] border-b border-brand-navy/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-brand-navy/60">
            <span className="font-bold text-brand-navy">{filteredAndSortedStories.length}</span> article{filteredAndSortedStories.length > 1 ? 's' : ''} trouvé{filteredAndSortedStories.length > 1 ? 's' : ''}
            {activeFilterCount > 0 && (
              <span className="ml-2">· <span className="text-brand-coral">{activeFilterCount}</span> filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}</span>
            )}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-brand-coral hover:text-brand-coral/80 transition-colors"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      </section>


      {/* Editorial Section */}
      {activeCategory === 'all' && featuredEditorials.length > 0 && (
        <section className="py-12 px-6 bg-gradient-to-b from-brand-turquoise/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="section-label !text-brand-turquoise">Editoriaux</span>
                <h2 className="text-3xl font-display font-black">Articles a la une</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {featuredEditorials.map((editorial: any) => (
                <div key={editorial.id} onClick={() => navigate(`/article/${editorial.slug || editorial.id}`)} className="cursor-pointer">
                  <EditorialCard story={editorial} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredAndSortedStories.map((story) => (
                <ImmersiveStoryCard
                  key={story.id}
                  story={story}
                  onClick={() => navigate(`/article/${story.slug || story.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-brand-navy/20" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Aucun résultat</h3>
              <p className="text-brand-navy/60 mb-6">
                Aucun article ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-brand-coral text-white rounded-full font-bold hover:bg-brand-coral/90 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
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
