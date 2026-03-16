import React from 'react';
import { Menu, Search, User, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-coral/30">
            R
          </div>
          <span className="font-display font-bold text-xl tracking-tighter">
            RunWeek<span className="text-brand-coral">.</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-brand-coral transition-colors">Magazine</a>
          <a href="#" className="hover:text-brand-coral transition-colors">Trail</a>
          <a href="#" className="hover:text-brand-coral transition-colors">Training</a>
          <a href="#" className="hover:text-brand-coral transition-colors">Community</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <button className="hidden sm:flex items-center gap-2 btn-primary !py-2 !px-4 text-sm">
          <PlusCircle size={18} />
          <span>Publish Run</span>
        </button>
        <button className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
          <User size={20} />
        </button>
        <button className="md:hidden p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
};
