import React, { useEffect, useState } from 'react';
import { 
  Users, Shield, Calendar, Mail, Zap, Sparkles, 
  CheckCircle, XCircle, BarChart3, Settings as SettingsIcon,
  RefreshCw, BookOpen, ArrowRight, Layout, PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Settings, AdminStats } from '../types';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pendingStories, setPendingStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes, settingsRes, pendingRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/stories/pending')
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (pendingRes.ok) setPendingStories(await pendingRes.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (newSettings: Settings) => {
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/admin/settings/llm_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        setSettings(newSettings);
        alert('Paramètres mis à jour !');
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/stories/${id}/approve`, { method: 'POST' });
      if (response.ok) {
        setPendingStories(prev => prev.filter(s => s.id !== id));
        fetchData(); // Refresh stats
      }
    } catch (err) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Voulez-vous vraiment rejeter cet article ?')) return;
    try {
      const response = await fetch(`/api/admin/stories/${id}/reject`, { method: 'POST' });
      if (response.ok) {
        setPendingStories(prev => prev.filter(s => s.id !== id));
        fetchData(); // Refresh stats
      }
    } catch (err) {
      alert('Erreur lors du rejet');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 bg-red-50 rounded-xl">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-navy">Administration</h1>
          <p className="text-brand-navy/60">Gérez les utilisateurs et le contenu de RunWeek</p>
        </div>
        <div className="bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-full flex items-center gap-2 font-medium">
          <Shield size={18} />
          Mode Admin
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/users" className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5 hover:bg-brand-navy/[0.02] transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <Users size={24} />
              </div>
              <span className="text-brand-navy/60 font-medium">Utilisateurs</span>
            </div>
            <ArrowRight size={18} className="text-brand-navy/20 group-hover:text-brand-coral transition-colors" />
          </div>
          <div className="text-3xl font-bold">{stats?.users || users.length}</div>
        </Link>
        <Link to="/admin/stories" className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5 hover:bg-brand-navy/[0.02] transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-coral/10 text-brand-coral rounded-xl">
                <BookOpen size={24} />
              </div>
              <span className="text-brand-navy/60 font-medium">Articles Run</span>
            </div>
            <ArrowRight size={18} className="text-brand-navy/20 group-hover:text-brand-coral transition-colors" />
          </div>
          <div className="text-3xl font-bold">{stats?.stories || 0}</div>
        </Link>
        <Link to="/admin/editorial" className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5 hover:bg-brand-navy/[0.02] transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-turquoise/10 text-brand-turquoise rounded-xl">
                <PenTool size={24} />
              </div>
              <span className="text-brand-navy/60 font-medium">Éditorial</span>
            </div>
            <ArrowRight size={18} className="text-brand-navy/20 group-hover:text-brand-coral transition-colors" />
          </div>
          <div className="text-sm font-bold text-brand-turquoise">Gérer le magazine</div>
        </Link>
        <Link to="/admin/ads" className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5 hover:bg-brand-navy/[0.02] transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                <Layout size={24} />
              </div>
              <span className="text-brand-navy/60 font-medium">Publicités</span>
            </div>
            <ArrowRight size={18} className="text-brand-navy/20 group-hover:text-brand-coral transition-colors" />
          </div>
          <div className="text-sm font-bold text-orange-500">Zones d'affichage</div>
        </Link>
        <Link to="/admin/stats" className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5 hover:bg-brand-navy/[0.02] transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                <BarChart3 size={24} />
              </div>
              <span className="text-brand-navy/60 font-medium">Stats Détaillées</span>
            </div>
            <ArrowRight size={18} className="text-brand-navy/20 group-hover:text-brand-coral transition-colors" />
          </div>
          <div className="text-sm font-bold text-purple-500 flex items-center gap-1">
            Voir les graphiques <RefreshCw size={14} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* LLM Config */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
          <div className="p-6 border-b border-brand-navy/5 bg-brand-navy/[0.02]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SettingsIcon size={20} className="text-brand-coral" />
              Configuration IA
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {settings && (
              <>
                <div>
                  <label className="text-xs font-bold uppercase text-brand-navy/40 mb-3 block">Moteur par défaut</label>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleUpdateSettings({...settings, default_llm: { engine: 'zai', model: 'glm-4' }})}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${settings.default_llm.engine === 'zai' ? 'border-brand-coral bg-brand-coral/5' : 'border-transparent bg-brand-navy/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={18} className={settings.default_llm.engine === 'zai' ? 'text-brand-coral' : 'text-brand-navy/30'} />
                        <span className="font-bold text-sm">Z.ai (GLM 4.7)</span>
                      </div>
                      {settings.default_llm.engine === 'zai' && <CheckCircle size={16} className="text-brand-coral" />}
                    </button>
                    <button 
                      onClick={() => handleUpdateSettings({...settings, default_llm: { engine: 'gemini', model: 'gemini-3.1-pro-preview' }})}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${settings.default_llm.engine === 'gemini' ? 'border-brand-coral bg-brand-coral/5' : 'border-transparent bg-brand-navy/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className={settings.default_llm.engine === 'gemini' ? 'text-brand-coral' : 'text-brand-navy/30'} />
                        <span className="font-bold text-sm">Gemini (3.1 Pro)</span>
                      </div>
                      {settings.default_llm.engine === 'gemini' && <CheckCircle size={16} className="text-brand-coral" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-brand-navy/40 mb-3 block">Moteurs Activés</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-brand-navy/5 rounded-xl">
                      <span className="text-sm font-medium">Z.ai</span>
                      <button 
                        onClick={() => handleUpdateSettings({...settings, llm_enabled: {...settings.llm_enabled, zai: !settings.llm_enabled.zai}})}
                        className={`w-10 h-6 rounded-full transition-colors relative ${settings.llm_enabled.zai ? 'bg-brand-turquoise' : 'bg-brand-navy/20'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.llm_enabled.zai ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/5 rounded-xl">
                      <span className="text-sm font-medium">Gemini</span>
                      <button 
                        onClick={() => handleUpdateSettings({...settings, llm_enabled: {...settings.llm_enabled, gemini: !settings.llm_enabled.gemini}})}
                        className={`w-10 h-6 rounded-full transition-colors relative ${settings.llm_enabled.gemini ? 'bg-brand-turquoise' : 'bg-brand-navy/20'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.llm_enabled.gemini ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Moderation */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
          <div className="p-6 border-b border-brand-navy/5 bg-brand-navy/[0.02] flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle size={20} className="text-brand-turquoise" />
              Modération des Articles
            </h2>
            <Link to="/admin/stories" className="text-brand-coral text-sm font-bold hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-brand-navy/5">
            {pendingStories.length === 0 ? (
              <div className="p-12 text-center text-brand-navy/40 italic">
                Aucun article en attente de modération.
              </div>
            ) : (
              pendingStories.map((story) => (
                <div key={story.id} className="p-6 flex items-center justify-between hover:bg-brand-navy/[0.01] transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-navy">{story.title}</span>
                    <span className="text-xs text-brand-navy/50">Par {story.author_name} • {new Date(story.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleApprove(story.id)}
                      className="p-2 bg-brand-turquoise/10 text-brand-turquoise rounded-lg hover:bg-brand-turquoise hover:text-white transition-all"
                      title="Approuver"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleReject(story.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Rejeter"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
        <div className="p-6 border-bottom border-brand-navy/5 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-brand-coral" />
            Liste des Utilisateurs
          </h2>
          <Link to="/admin/users" className="text-brand-coral text-sm font-bold hover:underline flex items-center gap-1">
            Gérer les membres <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-navy/5 text-brand-navy/60 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-brand-navy/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-navy">{u.name}</span>
                      <span className="text-sm text-brand-navy/60 flex items-center gap-1">
                        <Mail size={12} />
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-navy/60">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link to="/admin/users" className="text-brand-coral hover:underline text-sm font-medium">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
