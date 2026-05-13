import { useState } from 'react';

interface GarminConnectButtonProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const GarminConnectButton: React.FC<GarminConnectButtonProps> = ({
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
      // Redirection vers Garmin
      window.location.href = '/api/auth/garmin';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
        isConnected
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      {isLoading ? 'Chargement...' : isConnected ? 'Connecté à Garmin' : 'Connecter Garmin'}
    </button>
  );
};
