import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, BookOpen, CheckCircle, FileText, 
  BarChart3, PieChart, Activity, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import { AdminStats as AdminStatsType } from '../types';

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy/5 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-coral" size={48} />
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = ['#FF5C35', '#20C997', '#0A1128', '#FFC107'];

  return (
    <div className="min-h-screen bg-brand-navy/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-display font-black">Statistiques Admin</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <Activity size={16} className="text-brand-coral" />
            <span className="text-xs font-bold uppercase tracking-widest">Temps Réel</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Articles Totaux', value: stats.stories, icon: BookOpen, color: 'text-brand-coral', bg: 'bg-brand-coral/10' },
            { label: 'Publiés', value: stats.published, icon: CheckCircle, color: 'text-brand-turquoise', bg: 'bg-brand-turquoise/10' },
            { label: 'Brouillons', value: stats.drafts, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-brand-navy/5"
            >
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                <item.icon size={24} />
              </div>
              <div className="text-3xl font-black mb-1">{item.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-navy/40">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LLM Usage Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-navy/5"
          >
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
              <BarChart3 size={20} className="text-brand-coral" />
              Utilisation des Moteurs IA
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.llmUsage}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="engine" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#FF5C35" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-navy/5"
          >
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
              <PieChart size={20} className="text-brand-turquoise" />
              Répartition des Articles
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { name: 'Publiés', value: stats.published },
                      { name: 'Brouillons', value: stats.drafts }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#20C997" />
                    <Cell fill="#FFC107" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-turquoise" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Publiés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Brouillons</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <Activity className={className} size={size} />
);
