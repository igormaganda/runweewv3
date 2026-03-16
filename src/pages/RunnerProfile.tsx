import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Runner, RunStory } from '../types';
import { RunStoryCard } from '../components/RunStoryCard';
import { MapPin, Award, Settings, Grid, List, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/AuthContext';

export const RunnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [stories, setStories] = useState<RunStory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const runnerId = id || user?.id;
  const isOwner = user?.id?.toString() === runnerId?.toString();

  useEffect(() => {
    const fetchRunnerData = async () => {
      if (!runnerId) return;
      
      try {
        // Fetch runner info (in a real app, we'd have /api/users/:id)
        // For now, if it's the current user, use that, otherwise mock
        if (isOwner && user) {
          setRunner(user);
        } else {
          // Mock other runner
          setRunner({
            id: runnerId,
            name: "Runner " + runnerId,
            email: "",
            avatar: `https://i.pravatar.cc/150?u=${runnerId}`,
            bio: "Passionné de trail et d'ultra-distance.",
            stats: { totalDistance: 450, storiesPublished: 5 },
            role: 'user'
          });
        }

        const response = await fetch('/api/stories');
        const data = await response.json();
        
        const userStories = data
          .filter((s: any) => s.author_id.toString() === runnerId.toString())
          .map((s: any) => ({
            ...s,
            id: s.id.toString(),
            excerpt: s.content.substring(0, 150) + '...',
            category: 'Trail',
            author: {
              id: s.author_id.toString(),
              name: s.author_name || 'Anonymous',
              avatar: `https://i.pravatar.cc/150?u=${s.author_id}`,
              bio: '',
              stats: { totalDistance: 0, storiesPublished: 0 }
            },
            date: new Date(s.created_at).toLocaleDateString(),
            runData: s.stats || { distance: 0, pace: '0:00', elevation: 0, time: '0:00' }
          }));
        
        setStories(userStories);
      } catch (err) {
        console.error('Failed to fetch runner data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRunnerData();
  }, [runnerId, isOwner, user]);

  if (!runnerId && !loading) {
    return <div className="pt-32 text-center">Veuillez vous connecter pour voir votre profil.</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!runner) return null;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStories(stories.filter(s => s.id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  const handleToggleStatus = async (story: RunStory) => {
    const newStatus = story.status === 'published' ? 'draft' : 'published';
    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setStories(stories.map(s => s.id === story.id ? { ...s, status: newStatus } : s));
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error('Failed to update story status:', err);
    }
  };

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
                  {!isOwner && <button className="btn-primary !py-2 !px-6 text-sm">Suivre</button>}
                  {isOwner && (
                    <button className="p-2 border border-brand-navy/10 rounded-full hover:bg-brand-navy/5 transition-colors">
                      <Settings size={20} />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-brand-navy/70 max-w-2xl mb-8 leading-relaxed">
                {runner.bio || "Passionné de course à pied et de récits d'aventures."}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Distance Totale</p>
                  <p className="text-2xl font-display font-black text-brand-coral">{runner.stats.totalDistance} <span className="text-sm font-normal text-brand-navy/40">km</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Articles</p>
                  <p className="text-2xl font-display font-black text-brand-coral">{stories.length}</p>
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
          <AnimatePresence>
            {stories.map(story => (
              <motion.div 
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <Link to={`/article/${story.slug || story.id}`}>
                  <RunStoryCard story={story} />
                </Link>
                
                {isOwner && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.preventDefault(); handleToggleStatus(story); }}
                      className={`p-2 rounded-full shadow-lg transition-colors ${story.status === 'published' ? 'bg-brand-turquoise text-white' : 'bg-brand-navy/60 text-white'}`}
                      title={story.status === 'published' ? 'Mettre en brouillon' : 'Publier'}
                    >
                      {story.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); /* TODO: Edit logic */ }}
                      className="p-2 bg-white text-brand-navy rounded-full shadow-lg hover:text-brand-coral transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleDelete(story.id); }}
                      className="p-2 bg-white text-brand-coral rounded-full shadow-lg hover:bg-brand-coral hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                
                {story.status === 'draft' && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-brand-navy/80 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                    Brouillon
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {!loading && stories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-brand-navy/10">
              <p className="text-brand-navy/40">Aucun article pour le moment.</p>
              {isOwner && (
                <Link to="/generator" className="mt-4 inline-block text-brand-coral font-bold hover:underline">
                  Créer mon premier récit
                </Link>
              )}
            </div>
          )}
          
          {loading && (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
