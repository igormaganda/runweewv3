import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Mic, Image as ImageIcon, MapPin, Sparkles, 
  CheckCircle, ArrowRight, ArrowLeft, Loader2, 
  PlusCircle, Zap, Share2, Twitter, Facebook, Linkedin, ExternalLink,
  X, Trash2, Video, Music
} from 'lucide-react';
import { generateRunStory, AIEngine, analyzeMedia, getDefaultLLM } from '../services/aiService';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { useAuth } from '../components/AuthContext';
import { ImageAnalysis } from '../types';

export const RunStoryGenerator: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [storyType, setStoryType] = useState<'user_story' | 'editorial'>(user?.role === 'admin' ? 'editorial' : 'user_story');
  const [engine, setEngine] = useState<AIEngine>('zai');
  const [publishedStory, setPublishedStory] = useState<any>(null);
  const [runData, setRunData] = useState({
    distance: 10.5,
    pace: '5:30',
    elevation: 120,
    time: '57:45'
  });
  const [notes, setNotes] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [media, setMedia] = useState<{ file: File; preview: string; type: 'image' | 'video' | 'audio'; analysis?: any }[]>([]);
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const canSelectLLM = user?.role === 'admin';

  useEffect(() => {
    const fetchDefaultLLM = async () => {
      const settings = await getDefaultLLM();
      setEngine(settings.default_llm.engine as AIEngine);
    };
    fetchDefaultLLM();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const story = await generateRunStory(runData, notes, engine, voiceTranscript);
      setGeneratedStory(story);
      setStep(4);
    } catch (error) {
      alert("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    
    setIsAnalyzingMedia(true);
    try {
      const analysis = await analyzeMedia(file);
      setMedia(prev => [...prev, { file, preview, type, analysis }]);
      
      // Automatically enrich notes/transcript with analysis
      if (analysis.description) {
        setNotes(prev => prev + `\n[Média ${type}: ${analysis.description}]`);
      }
      if (analysis.transcript) {
        setVoiceTranscript(prev => prev + (prev ? ' ' : '') + analysis.transcript);
      }
    } catch (error) {
      setMedia(prev => [...prev, { file, preview, type }]);
    } finally {
      setIsAnalyzingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!generatedStory) return;
    setIsPublishing(true);
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedStory.title,
          content: generatedStory.content,
          stats: runData,
          status: status,
          type: storyType,
          image_url: 'https://picsum.photos/seed/run/1200/800', // Placeholder
          emotion: generatedStory.emotion,
          terrain: generatedStory.terrain,
          ambiance: generatedStory.ambiance,
          intensity: generatedStory.intensity
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPublishedStory(data);
        setStep(5);
      } else {
        alert("Erreur lors de la publication.");
      }
    } catch (err) {
      console.error('Failed to publish story:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const steps = [
    { id: 1, title: "Données du Run", icon: MapPin },
    { id: 2, title: "Ressenti & Notes", icon: Mic },
    { id: 3, title: "Photos", icon: ImageIcon },
    { id: 4, title: "Aperçu IA", icon: Sparkles }
  ];

  const shareUrl = publishedStory ? `${window.location.origin}/article/${publishedStory.slug || publishedStory.id}` : '';
  const shareText = publishedStory ? `Découvrez mon nouveau RunStory : ${publishedStory.title}` : '';

  const socialLinks = [
    { 
      name: 'X', 
      icon: Twitter, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:text-black'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#1877F2]'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#0A66C2]'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-navy/5 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= s.id ? 'bg-brand-coral text-white' : 'bg-white border border-brand-navy/10 text-brand-navy/30'
              }`}>
                {step > s.id ? <CheckCircle size={20} /> : <s.icon size={20} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                step >= s.id ? 'text-brand-coral' : 'text-brand-navy/30'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl border border-brand-navy/5 shadow-xl"
          >
            <h2 className="text-3xl font-display font-black mb-6">Importez votre séance</h2>
            
            {canSelectLLM && (
              <div className="mb-8 p-6 bg-brand-navy/5 rounded-2xl border border-brand-navy/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-navy/40 mb-4">Moteur d'IA (Admin Only)</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setEngine('zai')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative ${
                      engine === 'zai' ? 'border-brand-coral bg-white shadow-md' : 'border-transparent bg-white/50 grayscale opacity-50'
                    }`}
                  >
                    {engine === 'zai' && (
                      <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        Par défaut
                      </span>
                    )}
                    <Zap size={24} className={engine === 'zai' ? 'text-brand-coral' : ''} />
                    <div className="text-center">
                      <div className="font-bold text-sm">Z.ai</div>
                      <div className="text-[10px] opacity-50 uppercase font-black">GLM 4.7</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setEngine('gemini')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      engine === 'gemini' ? 'border-brand-coral bg-white shadow-md' : 'border-transparent bg-white/50 grayscale opacity-50'
                    }`}
                  >
                    <Sparkles size={24} className={engine === 'gemini' ? 'text-brand-coral' : ''} />
                    <div className="text-center">
                      <div className="font-bold text-sm">Gemini</div>
                      <div className="text-[10px] opacity-50 uppercase font-black">3.1 Pro</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-8 border-2 border-dashed border-brand-navy/10 rounded-2xl flex flex-col items-center justify-center text-center hover:border-brand-coral/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-brand-coral/10 rounded-full flex items-center justify-center text-brand-coral mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="font-bold mb-2">Connecter Strava</h3>
                <p className="text-sm text-brand-navy/50">Importez automatiquement vos données GPS.</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold">Saisie manuelle</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-brand-navy/40 mb-1 block">Distance (km)</label>
                    <input 
                      type="number" 
                      value={runData.distance}
                      onChange={e => setRunData({...runData, distance: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-navy/10 focus:ring-2 focus:ring-brand-coral outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-brand-navy/40 mb-1 block">Allure (min/km)</label>
                    <input 
                      type="text" 
                      value={runData.pace}
                      onChange={e => setRunData({...runData, pace: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-navy/10 focus:ring-2 focus:ring-brand-coral outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                Suivant <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl border border-brand-navy/5 shadow-xl"
          >
            <h2 className="text-3xl font-display font-black mb-6">Racontez votre expérience</h2>
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-brand-sky rounded-2xl">
                <VoiceRecorder onTranscript={setVoiceTranscript} />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">Notes écrites</label>
                <textarea 
                  rows={6}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Comment vous sentiez-vous ? Quel était le paysage ? Un moment fort ?"
                  className="w-full px-6 py-4 rounded-2xl border border-brand-navy/10 focus:ring-2 focus:ring-brand-coral outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-brand-navy/50 font-bold">
                <ArrowLeft size={20} /> Retour
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex items-center gap-2">
                Suivant <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl border border-brand-navy/5 shadow-xl"
          >
            <h2 className="text-3xl font-display font-black mb-6">Ajoutez vos souvenirs</h2>
            <p className="text-brand-navy/60 mb-8">Importez des photos, vidéos ou enregistrements audio pour enrichir votre récit. L'IA les analysera automatiquement.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {media.map((item, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group bg-brand-navy/5">
                  {item.type === 'image' && <img src={item.preview} alt="Run" className="w-full h-full object-cover" />}
                  {item.type === 'video' && (
                    <div className="w-full h-full flex items-center justify-center bg-brand-navy/10">
                      <Video size={32} className="text-brand-navy/30" />
                    </div>
                  )}
                  {item.type === 'audio' && (
                    <div className="w-full h-full flex items-center justify-center bg-brand-navy/10">
                      <Music size={32} className="text-brand-navy/30" />
                    </div>
                  )}
                  
                  <button 
                    onClick={() => removeMedia(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  {item.analysis && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-[8px] text-white italic line-clamp-2">
                      {item.analysis.description}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Upload Buttons */}
              <label className="aspect-square border-2 border-dashed border-brand-navy/10 rounded-2xl flex flex-col items-center justify-center text-brand-navy/20 hover:border-brand-coral/50 cursor-pointer transition-colors">
                {isAnalyzingMedia ? (
                  <Loader2 size={24} className="animate-spin text-brand-coral" />
                ) : (
                  <>
                    <ImageIcon size={24} />
                    <span className="text-[8px] font-bold uppercase mt-2 text-center">Photo</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'image')} disabled={isAnalyzingMedia} />
              </label>

              <label className="aspect-square border-2 border-dashed border-brand-navy/10 rounded-2xl flex flex-col items-center justify-center text-brand-navy/20 hover:border-brand-coral/50 cursor-pointer transition-colors">
                {isAnalyzingMedia ? (
                  <Loader2 size={24} className="animate-spin text-brand-coral" />
                ) : (
                  <>
                    <Video size={24} />
                    <span className="text-[8px] font-bold uppercase mt-2 text-center">Vidéo</span>
                  </>
                )}
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'video')} disabled={isAnalyzingMedia} />
              </label>

              <label className="aspect-square border-2 border-dashed border-brand-navy/10 rounded-2xl flex flex-col items-center justify-center text-brand-navy/20 hover:border-brand-coral/50 cursor-pointer transition-colors">
                {isAnalyzingMedia ? (
                  <Loader2 size={24} className="animate-spin text-brand-coral" />
                ) : (
                  <>
                    <Music size={24} />
                    <span className="text-[8px] font-bold uppercase mt-2 text-center">Audio</span>
                  </>
                )}
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'audio')} disabled={isAnalyzingMedia} />
              </label>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-brand-navy/50 font-bold">
                <ArrowLeft size={20} /> Retour
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Générer mon article
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && generatedStory && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[2rem] border border-brand-navy/5 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-coral" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">AI Generated Story</span>
                </div>
                <div className="flex bg-brand-navy/5 p-1 rounded-full">
                  <button 
                    onClick={() => setStatus('published')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${status === 'published' ? 'bg-white text-brand-coral shadow-sm' : 'text-brand-navy/40'}`}
                  >
                    Publier
                  </button>
                  <button 
                    onClick={() => setStatus('draft')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${status === 'draft' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-navy/40'}`}
                  >
                    Brouillon
                  </button>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex bg-brand-navy/5 p-1 rounded-full">
                    <button 
                      onClick={() => setStoryType('editorial')}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${storyType === 'editorial' ? 'bg-white text-brand-turquoise shadow-sm' : 'text-brand-navy/40'}`}
                    >
                      Éditorial
                    </button>
                    <button 
                      onClick={() => setStoryType('user_story')}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${storyType === 'user_story' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-navy/40'}`}
                    >
                      Utilisateur
                    </button>
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight italic">
                {generatedStory.title}
              </h1>
              
              <p className="text-xl text-brand-navy/70 font-light mb-8 italic border-l-4 border-brand-coral pl-6">
                {generatedStory.excerpt}
              </p>
              
              <div className="prose prose-brand max-w-none text-brand-navy/80 leading-relaxed space-y-4 mb-10">
                {generatedStory.content.split('\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              
              <div className="bg-brand-turquoise/5 p-8 rounded-2xl border border-brand-turquoise/10">
                <h4 className="flex items-center gap-2 font-display font-bold text-brand-turquoise mb-4">
                  <Zap size={20} /> Training Insight
                </h4>
                <p className="text-sm text-brand-navy/70 italic">
                  {generatedStory.trainingInsight}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button onClick={() => setStep(3)} className="text-brand-navy/50 font-bold">
                Modifier les entrées
              </button>
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    {status === 'published' ? 'Publier dans le magazine' : 'Enregistrer en brouillon'} 
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && publishedStory && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-brand-turquoise/10 text-brand-turquoise rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-4xl font-display font-black mb-4">
              {status === 'published' ? 'Article publié !' : 'Brouillon enregistré !'}
            </h2>
            <p className="text-brand-navy/60 max-w-md mx-auto mb-12">
              {status === 'published' 
                ? "Votre récit est maintenant disponible dans le magazine. Partagez-le avec votre communauté !" 
                : "Votre brouillon a été sauvegardé. Vous pourrez le retrouver et le publier plus tard."}
            </p>

            {status === 'published' && (
              <div className="flex flex-col items-center gap-8 mb-12">
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a 
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-white border border-brand-navy/5 shadow-lg rounded-2xl transition-all hover:scale-110 ${link.color}`}
                    >
                      <link.icon size={32} />
                    </a>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-brand-navy/5 rounded-xl border border-brand-navy/10 w-full max-w-sm">
                  <input 
                    type="text" 
                    readOnly 
                    value={shareUrl}
                    className="bg-transparent border-none text-xs font-mono flex-1 outline-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert("Lien copié !");
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-brand-coral"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/article/${publishedStory.slug || publishedStory.id}`} className="btn-primary flex items-center justify-center gap-2">
                Voir l'article <ExternalLink size={20} />
              </Link>
              <Link to="/" className="px-8 py-4 border border-brand-navy/10 rounded-full font-bold hover:bg-brand-navy/5 transition-all">
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
