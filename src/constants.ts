import { RunStory, CommunityChallenge } from './types';

export const MOCK_STORIES: RunStory[] = [
  {
    id: '1',
    title: "Le Sommet de l'Effort : Mon Premier Ultra dans les Pyrénées",
    excerpt: "80km de crêtes, de doutes et de pure magie sous les étoiles du GR10.",
    content: "",
    category: 'Trail',
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    date: "12 Mars 2026",
    isFeatured: true,
    author: {
      id: 'r1',
      name: "Thomas Roche",
      avatar: "https://i.pravatar.cc/150?u=thomas",
      bio: "Passionné de montagne et de longues distances.",
      stats: { totalDistance: 1240, storiesPublished: 8 }
    },
    runData: {
      distance: 82.4,
      pace: "8:45",
      elevation: 4500,
      time: "12h 45min"
    }
  },
  {
    id: '2',
    title: "Marathon de Paris : Briser la Barrière des 3 Heures",
    excerpt: "Retour sur 42km de gestion millimétrée et un final au bout de soi-même.",
    content: "",
    category: 'Race',
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    date: "10 Mars 2026",
    isTrending: true,
    author: {
      id: 'r2',
      name: "Julie Martin",
      avatar: "https://i.pravatar.cc/150?u=julie",
      bio: "Chasseuse de chronos sur bitume.",
      stats: { totalDistance: 850, storiesPublished: 12 }
    },
    runData: {
      distance: 42.2,
      pace: "4:12",
      elevation: 150,
      time: "2h 57min"
    }
  },
  {
    id: '3',
    title: "L'Aube Urbaine : Redécouvrir Lyon au Petit Matin",
    excerpt: "Quand la ville appartient encore aux coureurs et aux rêveurs.",
    content: "",
    category: 'Lifestyle',
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop",
    date: "14 Mars 2026",
    author: {
      id: 'r3',
      name: "Marc Durand",
      avatar: "https://i.pravatar.cc/150?u=marc",
      bio: "Explorateur urbain en baskets.",
      stats: { totalDistance: 420, storiesPublished: 5 }
    },
    runData: {
      distance: 12.5,
      pace: "5:20",
      elevation: 80,
      time: "1h 06min"
    }
  }
];

export const MOCK_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'c1',
    title: "Vertical March",
    description: "Grimpez 2000m de D+ cumulé ce mois-ci.",
    participantsCount: 1240,
    daysLeft: 15,
    imageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop"
  }
];
