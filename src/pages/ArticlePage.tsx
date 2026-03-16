import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, Heart, MessageSquare, ArrowLeft, Zap, Loader2, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${slug}`);
        if (!response.ok) throw new Error('Story not found');
        const data = await response.json();
        setStory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-coral" size={48} />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-black mb-4">Oups !</h1>
        <p className="text-brand-navy/60 mb-8">Ce récit semble s'être perdu en chemin.</p>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      {/* Article Hero */}
      <header className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={story.image_url || 'https://picsum.photos/seed/run/1200/800'} 
          alt={story.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} /> Retour au magazine
            </button>
            <span className="px-4 py-1.5 bg-brand-coral rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 inline-block">
              {story.status === 'draft' ? 'Brouillon' : 'Récit de Course'}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight italic mb-8">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-coral flex items-center justify-center text-white font-bold">
                  {story.author_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{story.author_name || 'Anonyme'}</p>
                  <p className="text-[10px] uppercase tracking-wider">{new Date(story.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-6 border-l border-white/20 pl-8">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">Distance</p>
                  <p className="text-xl font-display font-bold">{story.stats?.distance}km</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">Allure</p>
                  <p className="text-xl font-display font-bold">{story.stats?.pace}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-60">D+</p>
                  <p className="text-xl font-display font-bold">{story.stats?.elevation}m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-3">
          <div className="prose prose-lg prose-brand max-w-none text-brand-navy/80 leading-relaxed space-y-8">
            {story.content.split('\n').map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-brand-navy/5 flex items-center justify-between relative">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-coral transition-colors">
                <Heart size={24} /> <span>{Math.floor(Math.random() * 100)}</span>
              </button>
              <button className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-coral transition-colors">
                <MessageSquare size={24} /> <span>{Math.floor(Math.random() * 20)}</span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowShare(!showShare)}
                className={`p-3 rounded-full transition-all ${showShare ? 'bg-brand-coral text-white' : 'bg-brand-navy/5 hover:bg-brand-coral hover:text-white'}`}
              >
                <Share2 size={24} />
              </button>
              
              <AnimatePresence>
                {showShare && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full right-0 mb-4 bg-white shadow-2xl rounded-2xl p-4 flex gap-4 border border-brand-navy/5 z-50"
                  >
                    {socialLinks.map((link) => (
                      <a 
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-brand-navy/5 rounded-xl transition-colors text-brand-navy/60 hover:text-brand-coral flex flex-col items-center gap-1"
                      >
                        <link.icon size={20} />
                        <span className="text-[10px] font-bold">{link.name}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <aside className="lg:col-span-1 space-y-12">
          <div className="bg-brand-sky p-8 rounded-3xl sticky top-32">
            <h4 className="font-display font-black mb-6 flex items-center gap-2">
              <Zap className="text-brand-coral" size={20} /> Training Insight
            </h4>
            <p className="text-sm text-brand-navy/70 italic leading-relaxed mb-6">
              "Analyse IA : Votre régularité sur ce parcours de {story.stats?.distance}km est impressionnante."
            </p>
            <div className="h-2 w-full bg-brand-navy/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-turquoise w-[85%]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-brand-turquoise">Endurance Score: 85%</p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
