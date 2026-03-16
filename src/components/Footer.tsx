import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center text-white font-black text-xl">
              R
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter">
              RunWeek<span className="text-brand-coral">.</span>
            </span>
          </div>
          <p className="text-white/60 max-w-sm mb-8">
            The AI-powered running magazine where your data becomes your story. 
            Join the global community of storytellers.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Strava', 'LinkedIn'].map(social => (
              <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="sr-only">{social}</span>
                <div className="w-5 h-5 bg-white/20 rounded-sm" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-6">Magazine</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Latest Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trail Adventures</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Race Experiences</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Training Insights</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Publish a Run</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community Clubs</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Challenges</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40">
        <p>© 2026 RunWeek Magazine. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
