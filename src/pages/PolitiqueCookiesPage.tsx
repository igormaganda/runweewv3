import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings, Shield, BarChart3, Megaphone, ArrowLeft } from 'lucide-react';

export const PolitiqueCookiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold">Politique de Cookies</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 13 mai 2026</p>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Cette page explique les cookies utilisés sur runweek.fr et comment les gérer.
          </p>

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Cookies strictement nécessaires
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Indispensables au fonctionnement (authentification, sécurité). Pas de consentement requis.
          </p>

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Cookies analytiques
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Mesure d&apos;audience anonymisée. Consentement requis.
          </p>

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-purple-600" />
            Cookies marketing
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Publicités et contenus personnalisés. Consentement requis.
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-6">
            Gérez vos préférences via la bannière cookies ou les paramètres de votre navigateur.
          </p>
        </div>
      </main>
    </div>
  );
};
