import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      accepted: true,
      analytics: true,
      marketing: true,
      date: new Date().toISOString()
    }));
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      accepted: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString()
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-6 w-6 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              🍪 Nous utilisons des cookies
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Pour améliorer votre expérience et mesurer l&apos;audience.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={acceptEssential}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Essentiels
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tout accepter
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
