import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Share2, Heart, MessageSquare, 
  ArrowLeft, Zap, Loader2, Twitter, Facebook, Linkedin, 
  ChevronUp, Bookmark, MoreHorizontal, Award, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storyRes, adsRes] = await Promise.all([
          fetch(`/api/stories/${slug}`),
          fetch('/api/ads?position=article_sidebar')
        ]);

        if (!storyRes.ok) throw new Error('Story not found');
        
        setStory(await storyRes.json());
        if (adsRes.ok) setAds(await adsRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1128]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#FF5C35]" size={48} />
          <p className="text-white/40 font-display uppercase tracking-widest text-xs">Chargement du récit...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0A1128]">
        <h1 className="text-6xl font-display font-black mb-4 text-white">404</h1>
        <p className="text-white/60 mb-8 max-w-md">Ce récit semble s'être perdu en chemin ou n'a jamais existé.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Retour au magazine</button>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = story.title;

  const socialLinks = [
    { name: 'X', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-brand-coral/20">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-coral z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Floating Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-brand-navy text-white rounded-full shadow-2xl z-50 hover:bg-brand-coral transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Article Hero */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={story.image_url || 'https://picsum.photos/seed/run/1920/1080'} 
          alt={story.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20">
          <div className="max-w-5xl mx-auto w-full">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-sm font-bold uppercase tracking-widest">Retour au magazine</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                {story.type === 'editorial' && (
                  <span className="px-4 py-1.5 bg-brand-turquoise rounded-full text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                    <Zap size={10} className="fill-white" /> Éditorial
                  </span>
                )}
                <span className="px-4 py-1.5 bg-brand-coral rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  {story.terrain || 'Course'}
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> 5 min de lecture
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] italic mb-12 tracking-tighter">
                {story.title}
              </h1>
              
              <div className="flex flex-wrap items-end justify-between gap-8 border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-brand-coral/20 border border-white/10 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {story.author_photo ? (
                      <img src={story.author_photo} alt={story.author_name} className="w-full h-full object-cover" />
                    ) : (
                      story.author_name?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white leading-none mb-1">{story.author_name || 'Anonyme'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                      Publié le {new Date(story.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-12">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Distance</p>
                    <p className="text-3xl font-display font-black text-white">{story.stats?.distance}<span className="text-brand-coral text-sm ml-0.5">KM</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Allure</p>
                    <p className="text-3xl font-display font-black text-white">{story.stats?.pace}<span className="text-brand-coral text-sm ml-0.5">/KM</span></p>
                  </div>
                  <div className="hidden sm:block text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Dénivelé</p>
                    <p className="text-3xl font-display font-black text-white">{story.stats?.elevation}<span className="text-brand-coral text-sm ml-0.5">M</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Article Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Left: Actions */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 flex flex-col items-center gap-8">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex flex-col items-center gap-1 transition-colors ${isLiked ? 'text-brand-coral' : 'text-brand-navy/20 hover:text-brand-coral'}`}
            >
              <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-[10px] font-bold">124</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-brand-navy/20 hover:text-brand-coral transition-colors">
              <MessageSquare size={28} />
              <span className="text-[10px] font-bold">12</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-brand-navy/20 hover:text-brand-coral transition-colors">
              <Bookmark size={28} />
              <span className="text-[10px] font-bold">Save</span>
            </button>
            <div className="h-px w-8 bg-brand-navy/5" />
            <button 
              onClick={() => setShowShare(!showShare)}
              className={`flex flex-col items-center gap-1 transition-colors ${showShare ? 'text-brand-coral' : 'text-brand-navy/20 hover:text-brand-coral'}`}
            >
              <Share2 size={28} />
              <span className="text-[10px] font-bold">Share</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-7">
          <div className="prose prose-xl prose-brand max-w-none">
            <p className="text-2xl font-serif italic text-brand-navy/60 leading-relaxed mb-12 border-l-4 border-brand-coral pl-8 py-2">
              {story.excerpt || "Un récit immersif au cœur de l'effort et de la nature."}
            </p>
            
            <div className="font-serif text-xl text-brand-navy/80 leading-[1.8] space-y-10 first-letter:text-7xl first-letter:font-black first-letter:text-brand-coral first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
              {story.content.split('\n').map((p: string, i: number) => (
                p.trim() && <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Tags / Meta */}
          <div className="mt-20 flex flex-wrap gap-2">
            {['Performance', story.terrain, story.emotion, 'RunWeek'].filter(Boolean).map(tag => (
              <span key={tag} className="px-4 py-2 bg-brand-navy/5 text-brand-navy/60 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-coral hover:text-white transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Bio Card */}
          <div className="mt-20 p-10 bg-brand-navy text-white rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-brand-coral/20 flex-shrink-0 overflow-hidden border-2 border-white/10">
              {story.author_photo ? (
                <img src={story.author_photo} alt={story.author_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black">{story.author_name?.[0] || 'U'}</div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-display font-black mb-2">{story.author_name || 'Anonyme'}</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Passionné de course à pied et de récits immersifs. Partage ses aventures sur RunWeek pour inspirer la communauté.
              </p>
              <button className="px-6 py-2 bg-white/10 hover:bg-brand-coral text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                Voir le profil
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Right: Stats & Insight */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-brand-sky p-10 rounded-[2.5rem] sticky top-32 border border-brand-navy/5">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-display font-black flex items-center gap-2 text-brand-navy">
                <Zap className="text-brand-coral" size={20} /> Training Insight
              </h4>
              <Award className="text-brand-coral/40" size={24} />
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-3">Analyse IA</p>
                <p className="text-sm text-brand-navy/70 italic leading-relaxed">
                  {story.trainingInsight || "Votre régularité et votre gestion de l'effort sur ce parcours démontrent une excellente progression de votre base aérobie."}
                </p>
              </div>

              <div className="h-px w-full bg-brand-navy/5" />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Intensité</p>
                  <div className="flex items-center gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-4 w-1 rounded-full ${i < (story.intensity || 7) ? 'bg-brand-coral' : 'bg-brand-navy/10'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Récupération</p>
                  <p className="text-lg font-display font-bold text-brand-turquoise">24H</p>
                </div>
              </div>

              <button className="w-full py-4 bg-brand-navy text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-coral transition-all shadow-xl shadow-brand-navy/10">
                Détails Garmin Connect
              </button>
            </div>
          </div>

          {/* Ad Zone: Sidebar */}
          {ads.map(ad => (
            <div key={ad.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-brand-navy/5 shadow-sm">
              <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block relative group">
                <img src={ad.image_url} alt={ad.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors" />
                <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-brand-navy/40">Sponsorisé</span>
                <div className="p-6">
                  <h5 className="font-bold text-brand-navy text-sm group-hover:text-brand-coral transition-colors">{ad.title}</h5>
                </div>
              </a>
            </div>
          ))}

          {/* Quick Share Mobile */}
          <div className="lg:hidden flex justify-center gap-4 py-8 border-t border-brand-navy/5">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-brand-navy/5 rounded-2xl text-brand-navy/60 hover:text-brand-coral transition-colors"
              >
                <link.icon size={24} />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {/* Related Stories */}
      <section className="bg-brand-navy/5 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-coral mb-2 block">À lire ensuite</span>
              <h2 className="text-4xl font-display font-black text-brand-navy">Récits similaires</h2>
            </div>
            <button onClick={() => navigate('/')} className="hidden sm:flex items-center gap-2 text-brand-coral font-bold hover:gap-3 transition-all">
              Explorer tout <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* We'll just show a couple of placeholders or fetch real ones if we had an endpoint */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-brand-navy/5 group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="https://picsum.photos/seed/trail/800/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-display font-black mb-4 group-hover:text-brand-coral transition-colors">L'ascension du Mont Ventoux : Un défi contre soi-même</h3>
                <p className="text-brand-navy/60 text-sm line-clamp-2">Une aventure épique sur les pentes mythiques du Géant de Provence...</p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-brand-navy/5 group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="https://picsum.photos/seed/forest/800/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-display font-black mb-4 group-hover:text-brand-coral transition-colors">Brume matinale en forêt de Fontainebleau</h3>
                <p className="text-brand-navy/60 text-sm line-clamp-2">Le silence n'est rompu que par le souffle court et le craquement des feuilles...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal Overlay */}
      <AnimatePresence>
        {showShare && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShare(false)}
              className="absolute inset-0 bg-brand-navy/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center"
            >
              <button 
                onClick={() => setShowShare(false)}
                className="absolute top-8 right-8 p-2 hover:bg-brand-navy/5 rounded-full transition-colors"
              >
                <MoreHorizontal size={24} />
              </button>
              <div className="w-20 h-20 bg-brand-coral/10 text-brand-coral rounded-full flex items-center justify-center mx-auto mb-8">
                <Share2 size={40} />
              </div>
              <h3 className="text-3xl font-display font-black mb-2 text-brand-navy">Partager ce récit</h3>
              <p className="text-brand-navy/60 mb-10">Inspirez d'autres coureurs en partageant cette expérience unique.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-10">
                {socialLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-brand-navy/5 rounded-3xl hover:bg-brand-coral hover:text-white transition-all group"
                  >
                    <link.icon size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 p-4 bg-brand-navy/5 rounded-2xl border border-brand-navy/10">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl}
                  className="bg-transparent border-none text-[10px] font-mono flex-1 outline-none text-brand-navy/40"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Lien copié !");
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-brand-coral hover:underline"
                >
                  Copier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
