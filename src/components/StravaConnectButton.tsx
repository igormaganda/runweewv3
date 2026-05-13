import { useState } from 'react';

interface StravaConnectButtonProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const StravaConnectButton: React.FC<StravaConnectButtonProps> = ({
  isConnected,
  onConnect,
  onDisconnect
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isConnected) {
      setIsLoading(true);
      try {
        await onDisconnect();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      // Redirection vers Strava
      window.location.href = '/api/auth/strava';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
        isConnected
          ? 'bg-orange-500 text-white hover:bg-orange-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
      </svg>
      {isLoading ? 'Chargement...' : isConnected ? 'Connecte a Strava' : 'Connecter Strava'}
    </button>
  );
};
