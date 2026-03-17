import React, { useEffect, useState } from 'react';
import { 
  Users, Mail, Shield, Calendar, Edit, Trash2, 
  Search, ChevronLeft, X, Save, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        setUsers(await response.json());
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
        alert('Utilisateur mis à jour !');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-display font-bold text-brand-navy">Gestion des Utilisateurs</h1>
            <p className="text-brand-navy/60">Modifiez les rôles et les informations des membres</p>
          </div>
          <div className="bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-full flex items-center gap-2 font-medium">
            <Users size={18} />
            {users.length} Membres
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-navy/5 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2 bg-brand-navy/5 border-none rounded-xl focus:ring-2 focus:ring-brand-coral/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-navy/5 text-brand-navy/60 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Inscription</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              {filteredUsers.map((u) => (
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingUser(u)}
                        className="p-2 text-brand-navy/60 hover:bg-brand-navy/5 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
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
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-brand-navy/5 flex items-center justify-between bg-brand-navy/[0.02]">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit size={20} className="text-brand-coral" />
                Modifier l'utilisateur
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-brand-navy/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-1 block">Nom complet</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-brand-navy/5 border-none rounded-xl focus:ring-2 focus:ring-brand-coral/20 outline-none font-medium"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-1 block">Email</label>
                <input 
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-brand-navy/5 border-none rounded-xl focus:ring-2 focus:ring-brand-coral/20 outline-none font-medium"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-brand-navy/40 mb-1 block">Rôle</label>
                <select 
                  className="w-full px-4 py-2 bg-brand-navy/5 border-none rounded-xl focus:ring-2 focus:ring-brand-coral/20 outline-none font-medium"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-grow py-3 px-4 bg-brand-navy/5 text-brand-navy font-bold rounded-xl hover:bg-brand-navy/10 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-3 px-4 bg-brand-coral text-white font-bold rounded-xl hover:bg-brand-coral-dark shadow-lg shadow-brand-coral/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
