import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Mic, Image as ImageIcon, MapPin, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Loader2, PlusCircle, Zap } from 'lucide-react';
import { generateRunStory } from '../services/geminiService';

export const RunStoryGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [runData, setRunData] = useState({
    distance: 10.5,
    pace: '5:30',
    elevation: 120,
    time: '57:45'
  });
  const [notes, setNotes] = useState('');
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const story = await generateRunStory(runData, notes);
      setGeneratedStory(story);
      setStep(4);
    } catch (error) {
      alert("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { id: 1, title: "Données du Run", icon: MapPin },
    { id: 2, title: "Ressenti & Notes", icon: Mic },
    { id: 3, title: "Photos", icon: ImageIcon },
    { id: 4, title: "Aperçu IA", icon: Sparkles }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
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
              <div className="p-6 bg-brand-sky rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center text-white">
                    <Mic size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Note vocale</h4>
                    <p className="text-sm text-brand-navy/50">Parlez naturellement de votre séance.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white rounded-full text-xs font-bold shadow-sm">Enregistrer</button>
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
            <h2 className="text-3xl font-display font-black mb-6">Ajoutez des visuels</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="aspect-square border-2 border-dashed border-brand-navy/10 rounded-2xl flex items-center justify-center text-brand-navy/20 hover:border-brand-coral/50 cursor-pointer transition-colors">
                <PlusCircle size={32} />
              </div>
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
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-brand-coral" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">AI Generated Story</span>
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
              <button className="btn-primary flex items-center gap-2">
                Publier dans le magazine <CheckCircle size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
