import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { RunStoryGenerator } from './pages/RunStoryGenerator';
import { ArticlePage } from './pages/ArticlePage';
import { RunnerProfile } from './pages/RunnerProfile';
import LoginPage from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PlusCircle, User, LogOut, LogIn, Shield } from 'lucide-react';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5C35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="glass-nav px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-coral/30">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">
              RunWeek<span className="text-brand-coral">.</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-brand-coral transition-colors">Magazine</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-brand-coral font-bold flex items-center gap-1">
                <Shield size={16} />
                Admin
              </Link>
            )}
            <a href="#" className="hover:text-brand-coral transition-colors">Trail</a>
            <a href="#" className="hover:text-brand-coral transition-colors">Training</a>
            <a href="#" className="hover:text-brand-coral transition-colors">Community</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/generator" className="hidden sm:flex items-center gap-2 btn-primary !py-2 !px-4 text-sm">
                <PlusCircle size={18} />
                <span>Publish Run</span>
              </Link>
              <Link 
                to={`/profile/${user.id}`}
                className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors flex items-center gap-2"
              >
                <User size={20} />
                <span className="hidden md:inline text-sm font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-2 btn-primary !py-2 !px-4 text-sm"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={user ? <RunStoryGenerator /> : <Navigate to="/login" />} />
          <Route path="/generator/:id" element={user ? <RunStoryGenerator /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/article/:slug" element={<ArticlePage onBack={() => navigate('/')} />} />
          <Route path="/profile" element={<RunnerProfile />} />
          <Route path="/profile/:id" element={<RunnerProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
