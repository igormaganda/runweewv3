import React, { useEffect, useState } from 'react';
import { Users, Shield, Calendar, Mail } from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-navy/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-brand-navy/60 font-medium">Utilisateurs</span>
          </div>
          <div className="text-3xl font-bold">{users.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/5 overflow-hidden">
        <div className="p-6 border-bottom border-brand-navy/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-brand-coral" />
            Liste des Utilisateurs
          </h2>
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
                    <button className="text-brand-coral hover:underline text-sm font-medium">
                      Modifier
                    </button>
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
