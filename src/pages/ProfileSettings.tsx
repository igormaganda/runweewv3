import { useState, useEffect } from 'react';
import { GarminConnectButton } from "../components/GarminConnectButton";
import { StravaConnectButton } from '../components/StravaConnectButton';

interface Connection {
  id: number;
  provider: string;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
}

export const ProfileSettings = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
    fetchActivities();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/user/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } catch (err) {
      console.error('Failed to fetch connections:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activities?limit=10');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (provider: string) => {
    try {
      const res = await fetch(`/api/${provider}/sync`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`${data.synced} activités synchronisées`);
        fetchActivities();
      } else {
        alert(`${data.synced} activités synchronisées`);
      }
    } catch (err) {
      console.error('Sync error:', err);
      alert('Erreur lors de la synchronisation');
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const res = await fetch(`/api/${provider}/sync`, { method: 'POST' });
      if (res.ok) {
        fetchConnections();
        alert(`${data.synced} activités synchronisées`);
      }
    } catch (err) {
      console.error('Disconnect error:', err);
      alert('Erreur lors de la déconnexion');
    }
  };

  const handleCreateDraft = async (activityId: number) => {
    try {
      const res = await fetch(`/api/${provider}/sync`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`${data.synced} activités synchronisées`);
        fetchActivities();
      } else {
        alert(`${data.synced} activités synchronisées`);
      }
    } catch (err) {
      console.error('Create draft error:', err);
      alert('Erreur lors de la création du brouillon');
    }
  };

  const isStravaConnected = connections.some(c => c.provider === 'strava' && c.is_active);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>

      {/* Section Connexions */}
      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Connexions externes</h2>

        {/* Strava */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center gap-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FC4C02">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
            </svg>
            <div>
              <h3 className="font-semibold">Strava</h3>
              <p className="text-sm text-gray-500">
                Synchronisez vos activités de course
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isStravaConnected && (
              <button
                onClick={() => handleSync('strava')}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Synchroniser
              </button>
            )}
            <StravaConnectButton
              isConnected={isStravaConnected}
              onConnect={() => {}}
              onDisconnect={() => handleDisconnect('strava')}
            />
          </div>
        </div>

        {/* Garmin (à venir) */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">G</span>
            </div>
            <div>
              <h3 className="font-semibold">Garmin Connect</h3>
              <p className="text-sm text-gray-500">Bientôt disponible</p>
            </div>
          </div>
          <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
            Bientôt
          </button>
        </div>
      </section>

      {/* Section Synchronisation automatique */}
      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Synchronisation automatique</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
            className="w-5 h-5"
          />
          <span>Synchroniser automatiquement mes activités (quotidien)</span>
        </label>
      </section>

      {/* Section Activités */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Mes activités synchronisées</h2>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {isStravaConnected
                ? 'Aucune activité synchronisée. Cliquez sur "Synchroniser" pour importer vos activités Strava.'
                : 'Connectez votre compte Strava pour synchroniser vos activités.'}
            </p>
            {isStravaConnected && (
              <button
                onClick={() => handleSync('strava')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Synchroniser maintenant
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{activity.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.start_date).toLocaleDateString('fr-FR')} • {(activity.distance / 1000).toFixed(1)} km
                  </p>
                </div>
                {!activity.is_synced_to_story ? (
                  <button
                    onClick={() => handleCreateDraft(activity.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Créer un brouillon
                  </button>
                ) : (
                  <span className="text-sm text-green-600">Déjà synchronisé</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
