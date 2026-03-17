import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Plus, Search, Filter, 
  MoreVertical, Eye, Edit2, Trash2, 
  CheckCircle, Clock, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RunStory } from '../types';

export const AdminEditorial: React.FC = () => {
  const [stories, setStories] = useState<RunStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories?type=editorial');
      if (response.ok) {
        setStories(await response.json());
      }
    } catch (err) {
      console.error('Error fetching editorial stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article éditorial ?')) return;
    try {
      const response = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setStories(stories.filter(s => s.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-navy">Articles Éditoriaux</h1>
          <p className="text-brand-navy/60">Gérez le contenu officiel du magazine RunWeek</p>
        </div>
        <button 
          onClick={() => navigate('/generator')} 
          className="ml-auto flex items-center gap-2 bg-brand-coral text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-coral/90 transition-all shadow-lg shadow-brand-coral/20"
        >
          <Plus size={20} />
          Nouvel Article
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
        <div className="p-6 border-b border-brand-navy/5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-navy/5 rounded-xl text-sm font-medium hover:bg-brand-navy/10 transition-colors">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-navy/5 text-brand-navy/60 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Article</th>
                <th className="px-6 py-4 font-semibold">Auteur</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredStories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-navy/40 italic">
                    Aucun article éditorial trouvé.
                  </td>
                </tr>
              ) : (
                filteredStories.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-navy/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-brand-navy/5">
                          <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-navy line-clamp-1">{s.title}</span>
                          <span className="text-xs text-brand-navy/40">Slug: {s.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={s.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-brand-navy/70">{s.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-navy/60">
                      {new Date(s.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Publié
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/article/${s.slug}`}
                          className="p-2 hover:bg-brand-navy/5 rounded-lg text-brand-navy/40 hover:text-brand-navy transition-colors"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          to={`/generator/${s.id}`}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
