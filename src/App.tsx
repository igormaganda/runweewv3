import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from './pages/Home';
import { ExperienceHome } from './pages/ExperienceHome';
import { RunStoryGenerator } from './pages/RunStoryGenerator';
import { ArticlePage } from './pages/ArticlePage';
import { RunnerProfile } from './pages/RunnerProfile';
import LoginPage from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminStats } from './pages/AdminStats';
import { AdminStories } from './pages/AdminStories';
import { AdminUsers } from './pages/AdminUsers';
import { AdminAds } from './pages/AdminAds';
import { AdminEditorial } from './pages/AdminEditorial';
import { MagazinePage } from './pages/MagazinePage';
import { TrailPage } from './pages/TrailPage';
import { TrainingPage } from './pages/TrainingPage';
import { CommunityPage } from './pages/CommunityPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PlusCircle, User, LogOut, LogIn, Shield, Menu, X } from 'lucide-react';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF5C35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navLinks = [
    { to: '/magazine', label: 'Magazine' },
    { to: '/trail', label: 'Trail' },
    { to: '/training', label: 'Training' },
    { to: '/community', label: 'Community' },
  ];

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
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="hover:text-brand-coral transition-colors">{link.label}</Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-brand-coral font-bold flex items-center gap-1">
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/generator" className="flex items-center gap-2 btn-primary !py-2 !px-4 text-sm">
                  <PlusCircle size={18} />
                  <span>Publish Run</span>
                </Link>
                <Link 
                  to={`/profile/${user.id}`}
                  className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors flex items-center gap-2"
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 hover:bg-brand-navy/5 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-brand-navy/5 p-6 md:hidden flex flex-col gap-4 shadow-xl"
            >
              {navLinks.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="text-lg font-bold hover:text-brand-coral transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-lg font-bold text-brand-coral flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield size={20} /> Admin
                </Link>
              )}
              <hr className="border-brand-navy/5 my-2" />
              {user ? (
                <>
                  <Link 
                    to="/generator" 
                    className="btn-primary flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PlusCircle size={20} /> Publish Run
                  </Link>
                  <Link 
                    to={`/profile/${user.id}`}
                    className="flex items-center gap-2 font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} /> {user.name}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 font-bold text-red-500"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="btn-primary flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={20} /> Sign In
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ExperienceHome />} />
          <Route path="/magazine" element={<MagazinePage />} />
          <Route path="/trail" element={<TrailPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/old-home" element={<Home />} />
          <Route path="/generator" element={user ? <RunStoryGenerator /> : <Navigate to="/login" />} />
          <Route path="/generator/:id" element={user ? <RunStoryGenerator /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/stats" element={user?.role === 'admin' ? <AdminStats /> : <Navigate to="/" />} />
          <Route path="/admin/stories" element={user?.role === 'admin' ? <AdminStories /> : <Navigate to="/" />} />
          <Route path="/admin/editorial" element={user?.role === 'admin' ? <AdminEditorial /> : <Navigate to="/" />} />
          <Route path="/admin/ads" element={user?.role === 'admin' ? <AdminAds /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
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
