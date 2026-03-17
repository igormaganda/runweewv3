import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, ExternalLink, Layout, Sidebar, 
  Square, CheckCircle, XCircle, ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  format: string;
  position: string;
  status: string;
  created_at: string;
}

export const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    image_url: '',
    link_url: '',
    format: 'banner',
    position: 'home_top'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      if (response.ok) {
        setAds(await response.json());
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd)
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewAd({ title: '', image_url: '', link_url: '', format: 'banner', position: 'home_top' });
        fetchAds();
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout de la publicité');
    }
  };

  const handleDeleteAd = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette publicité ?')) return;
    try {
      const response = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'banner': return <Layout size={16} />;
      case 'sidebar': return <Sidebar size={16} />;
      case 'square': return <Square size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-navy">Gestion Publicitaire</h1>
          <p className="text-brand-navy/60">Gérez les emplacements et les bannières publicitaires</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="ml-auto flex items-center gap-2 bg-brand-coral text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-coral/90 transition-all shadow-lg shadow-brand-coral/20"
        >
          <Plus size={20} />
          Ajouter une Pub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-brand-navy/40 italic bg-white rounded-2xl border border-dashed border-brand-navy/20">
            Aucune publicité active.
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-brand-navy/5">
                <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    {getFormatIcon(ad.format)}
                    {ad.format}
                  </span>
                  <span className="px-2 py-1 bg-brand-navy/90 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {ad.position}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-navy mb-1">{ad.title}</h3>
                <a 
                  href={ad.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-brand-coral hover:underline flex items-center gap-1 mb-4"
                >
                  <ExternalLink size={12} />
                  {ad.link_url}
                </a>
                <div className="flex items-center justify-between pt-4 border-t border-brand-navy/5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                    <CheckCircle size={12} /> Actif
                  </span>
                  <button 
                    onClick={() => handleDeleteAd(ad.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-navy/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-display font-bold text-brand-navy mb-6">Nouvelle Publicité</h2>
            <form onSubmit={handleAddAd} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">Titre</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20"
                  value={newAd.title}
                  onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">URL de l'image</label>
                <input 
                  required
                  type="url" 
                  className="w-full px-4 py-3 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20"
                  value={newAd.image_url}
                  onChange={(e) => setNewAd({...newAd, image_url: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">URL de destination</label>
                <input 
                  required
                  type="url" 
                  className="w-full px-4 py-3 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20"
                  value={newAd.link_url}
                  onChange={(e) => setNewAd({...newAd, link_url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">Format</label>
                  <select 
                    className="w-full px-4 py-3 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20"
                    value={newAd.format}
                    onChange={(e) => setNewAd({...newAd, format: e.target.value})}
                  >
                    <option value="banner">Bannière</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="square">Carré</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-brand-navy/40 mb-2 block">Position</label>
                  <select 
                    className="w-full px-4 py-3 bg-brand-navy/5 rounded-xl border-none focus:ring-2 focus:ring-brand-coral/20"
                    value={newAd.position}
                    onChange={(e) => setNewAd({...newAd, position: e.target.value})}
                  >
                    <option value="home_top">Home Top</option>
                    <option value="home_middle">Home Middle</option>
                    <option value="article_sidebar">Article Sidebar</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-brand-navy/5 text-brand-navy font-bold rounded-xl hover:bg-brand-navy/10 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-coral text-white font-bold rounded-xl hover:bg-brand-coral/90 transition-colors shadow-lg shadow-brand-coral/20"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
