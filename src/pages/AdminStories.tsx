import React, { useEffect, useState } from 'react';
import { 
  BookOpen, CheckCircle, XCircle, Edit, Trash2, 
  Search, Filter, ExternalLink, ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Story {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  status: string;
  created_at: string;
  emotion: string;
  terrain: string;
}

export const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/admin/stories');
      if (response.ok) {
        setStories(await response.json());
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    try {
      const response = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setStories(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/stories/${id}/approve`, { method: 'POST' });
      if (response.ok) {
        setStories(prev => prev.map(s => s.id === id ? { ...s, status: 'published' } : s));
      }
    } catch (err) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const filteredStories = stories.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-brand-navy/60 hover:text-brand-coral transition-colors mb-4"
        >
          <ChevronLeft size={20} />
          Retour au tableau de bord
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-navy">Modération des Articles</h1>
            <p className="text-brand-navy/60">Gérez, modifiez ou supprimez les récits de la communauté</p>
          </div>
          <div className="bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-full flex items-center gap-2 font-medium">
            <BookOpen size={18} />
            {stories.length} Articles
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-navy/5 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30" size={18} />
          <input 
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            className="w-full pl-10 pr-4 py-2 bg-brand-navy/5 border-none rounded-xl focus:ring-2 focus:ring-brand-coral/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-brand-navy/30" />
          <select 
            className="bg-brand-navy/5 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-coral/20 outline-none text-sm font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">En attente (Brouillon)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-navy/5 text-brand-navy/60 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Article</th>
                <th className="px-6 py-4 font-semibold">Auteur</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              {filteredStories.map((s) => (
                <tr key={s.id} className="hover:bg-brand-navy/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-navy">{s.title}</span>
                      <span className="text-xs text-brand-navy/40 uppercase tracking-wider">{s.emotion} • {s.terrain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brand-navy/70">
                    {s.author_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      s.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {s.status === 'published' ? 'Publié' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-navy/60">
                    {new Date(s.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {s.status === 'draft' && (
                        <button 
                          onClick={() => handleApprove(s.id)}
                          className="p-2 text-brand-turquoise hover:bg-brand-turquoise/10 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <Link 
                        to={`/article/${s.slug}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        to={`/generator/${s.id}`}
                        className="p-2 text-brand-navy/60 hover:bg-brand-navy/5 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStories.length === 0 && (
            <div className="p-12 text-center text-brand-navy/40 italic">
              Aucun article trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
