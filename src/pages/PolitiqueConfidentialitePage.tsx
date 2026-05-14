import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Cookie, ListChecks, Lock, Mail, ArrowLeft } from 'lucide-react';

export const PolitiqueConfidentialitePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold">Politique de Confidentialité</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 13 mai 2026</p>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            RUNWEEK MEDIA s&apos;engage à protéger la vie privée des utilisateurs de runweek.fr, conformément au RGPD.
          </p>

          <h2 className="text-lg font-semibold mb-3">Données collectées</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Nous collectons : nom, email, photo de profil, données de performance sportive (distance, temps, allure),
            contenus générés (récits, commentaires).
          </p>

          <h2 className="text-lg font-semibold mb-3">Finalités</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Gestion du compte, publication de récits, suivi d&apos;entraînement, synchronisation Strava/Garmin (avec consentement),
            newsletter et amélioration du site.
          </p>

          <h2 className="text-lg font-semibold mb-3">Vos droits</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Accès, rectification, effacement, portabilité, opposition. Contactez-nous à :{' '}
            <a href="mailto:contact@runweek.fr" className="text-blue-600 hover:underline">contact@runweek.fr</a>
          </p>
        </div>
      </main>
    </div>
  );
};
