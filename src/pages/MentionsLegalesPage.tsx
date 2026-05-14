import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, MapPin, Phone, Scale, Cookie, Shield, ArrowLeft } from 'lucide-react';

export const MentionsLegalesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold">Mentions Légales</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 13 mai 2026</p>

        {/* Éditeur */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            1. Éditeur du site
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium">Dénomination sociale :</span> RUNWEEK MEDIA</p>
            <p><span className="font-medium">Forme juridique :</span> SAS (Société par Actions Simplifiée)</p>
            <p><span className="font-medium">SIREN :</span> 103 168 944</p>
            <p><span className="font-medium">SIRET :</span> 103 168 944 00017</p>
            <p><span className="font-medium">N° TVA intracommunautaire :</span> FR20 103168944</p>
            <p><span className="font-medium">Code NAF/APE :</span> 6312Z – Portails internet</p>
            <p><span className="font-medium">Siège social :</span> 173 Rue de Courcelles, 75017 Paris, France</p>
            <p><span className="font-medium">Directeur de la publication :</span> Monsieur Quentin Fourez</p>
            <p><span className="font-medium">Contact :</span> 
              <a href="mailto:contact@runweek.fr" className="text-blue-600 hover:underline">contact@runweek.fr</a>
            </p>
          </div>
        </section>

        {/* Hébergeur */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            2. Hébergeur
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium">Prestataire :</span> Microsoft Azure</p>
            <p><span className="font-medium">Adresse :</span> Microsoft France, 37 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux, France</p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            3. Propriété intellectuelle
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            L&apos;ensemble des contenus présents sur le site runweek.fr est protégé par le droit de la propriété intellectuelle. 
            Toute reproduction, représentation ou diffusion, même partielle, est interdite sans autorisation écrite préalable.
          </p>
        </section>

        {/* Cookies */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cookie className="h-5 w-5 text-orange-600" />
            4. Cookies
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Le site utilise des cookies pour améliorer l&apos;expérience utilisateur. Vous pouvez gérer vos préférences 
            via la bannière de cookies présente sur le site. Consultez notre{' '}
            <Link to="/politique-cookies" className="text-blue-600 hover:underline">Politique de Cookies</Link> pour plus d&apos;informations.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            5. Contact
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Pour toute question : <a href="mailto:contact@runweek.fr" className="text-blue-600 hover:underline">contact@runweek.fr</a>
          </p>
        </section>
      </main>
    </div>
  );
};
