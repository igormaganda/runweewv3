import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { RunStoryGenerator } from './pages/RunStoryGenerator';
import { ArticlePage } from './pages/ArticlePage';
import { RunnerProfile } from './pages/RunnerProfile';
import { MOCK_STORIES } from './constants';
import { RunStory, Runner } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'generator' | 'article' | 'profile'>('home');
  const [selectedStory, setSelectedStory] = useState<RunStory | null>(null);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);

  const handleStoryClick = (story: RunStory) => {
    setSelectedStory(story);
    setCurrentPage('article');
    window.scrollTo(0, 0);
  };

  const handleRunnerClick = (runner: Runner) => {
    setSelectedRunner(runner);
    setCurrentPage('profile');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="glass-nav px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-coral/30">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">
              RunWeek<span className="text-brand-coral">.</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setCurrentPage('home')} className="hover:text-brand-coral transition-colors">Magazine</button>
            <a href="#" className="hover:text-brand-coral transition-colors">Trail</a>
            <a href="#" className="hover:text-brand-coral transition-colors">Training</a>
            <a href="#" className="hover:text-brand-coral transition-colors">Community</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 btn-primary !py-2 !px-4 text-sm" onClick={() => setCurrentPage('generator')}>
            <PlusCircle size={18} />
            <span>Publish Run</span>
          </button>
          <button 
            className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors"
            onClick={() => handleRunnerClick(MOCK_STORIES[0].author)}
          >
            <User size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {currentPage === 'home' && <Home onStoryClick={handleStoryClick} />}
        {currentPage === 'generator' && <RunStoryGenerator />}
        {currentPage === 'article' && selectedStory && (
          <ArticlePage story={selectedStory} onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'profile' && selectedRunner && (
          <RunnerProfile runner={selectedRunner} onStoryClick={handleStoryClick} />
        )}
      </main>
      <Footer />
    </div>
  );
}

import { PlusCircle, User } from 'lucide-react';
