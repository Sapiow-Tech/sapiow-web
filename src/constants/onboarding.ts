// Constants pour l'onboarding des seekers et experts

/**
 * Mapping des IDs de domaines string vers IDs numériques
 * Basé sur les données API : Media=1, Culture=2, Business=3, Maison=4, Artisanat=5, Glow=6, Sport=7
 */
export const DOMAIN_ID_MAPPING: Record<string, number> = {
  media: 1,
  culture: 2,
  business: 3,
  maison: 4,
  artisanat: 5,
  glow: 6,
  sport: 7,
};

/**
 * Interface pour les domaines
 */
export interface Domain {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

/**
 * Liste des domaines disponibles
 */
export const DOMAINS: Domain[] = [
  {
    id: "media",
    name: "Média",
    icon: "/images/domains/media.svg",
    description: "Communication, journalisme, audiovisuel"
  },
  {
    id: "culture",
    name: "Culture",
    icon: "/images/domains/culture.svg",
    description: "Arts, littérature, spectacle"
  },
  {
    id: "business",
    name: "Business",
    icon: "/images/domains/business.svg",
    description: "Commerce, entrepreneuriat, finance"
  },
  {
    id: "maison",
    name: "Maison",
    icon: "/images/domains/maison.svg",
    description: "Décoration, bricolage, jardinage"
  },
  {
    id: "artisanat",
    name: "Artisanat",
    icon: "/images/domains/artisanat.svg",
    description: "Création manuelle, savoir-faire traditionnel"
  },
  {
    id: "glow",
    name: "Glow",
    icon: "/images/domains/glow.svg",
    description: "Bien-être, beauté, développement personnel"
  },
  {
    id: "sport",
    name: "Sport",
    icon: "/images/domains/sport.svg",
    description: "Activité physique, coaching, santé"
  }
];

/**
 * Mapping des noms de domaines API vers les icônes
 * Basé sur CategoryFilter.tsx pour la cohérence visuelle
 */
export const DOMAIN_ICON_MAPPING: Record<string, string> = {
  // Noms exacts de l'API (avec majuscules)
  "Media": "/assets/icons/podcast.svg",
  "Culture": "/assets/icons/culture.svg", 
  "Business": "/assets/icons/business.svg",
  "Maison": "/assets/icons/home.svg",
  "Artisanat": "/assets/icons/paintRoller.svg",
  "Glow": "/assets/icons/meditation.svg",
  "SelfeCare": "/assets/icons/meditation.svg",
  "Sport": "/assets/icons/balls.svg",
  
  // Noms en minuscules pour compatibilité
  "media": "/assets/icons/podcast.svg",
  "culture": "/assets/icons/culture.svg",
  "business": "/assets/icons/business.svg", 
  "maison": "/assets/icons/home.svg",
  "artisanat": "/assets/icons/paintRoller.svg",
  "glow": "/assets/icons/meditation.svg",
  "selfecare": "/assets/icons/meditation.svg",
  "sport": "/assets/icons/balls.svg",
};

/**
 * Fonction pour obtenir l'icône d'un domaine
 * Utilise le mapping des icônes de CategoryFilter pour la cohérence
 */
export const getDomainIcon = (domainName: string): string => {
  return DOMAIN_ICON_MAPPING[domainName] || "/assets/icons/star.svg"; // Icône par défaut
};

/**
 * Fonction pour obtenir un domaine par son ID
 */
export const getDomainById = (domainId: string): Domain | undefined => {
  return DOMAINS.find(d => d.id === domainId);
};

/**
 * Mapping des spécialités par domaine
 */
export const DOMAIN_SPECIALTIES: Record<string, string[]> = {
  media: [
    "Journalisme",
    "Production audiovisuelle",
    "Communication digitale",
    "Relations publiques",
    "Photographie",
    "Montage vidéo",
    "Animation",
    "Podcast",
    "Streaming",
    "Marketing digital"
  ],
  culture: [
    "Littérature",
    "Théâtre",
    "Musique",
    "Danse",
    "Arts plastiques",
    "Cinéma",
    "Histoire de l'art",
    "Critique culturelle",
    "Médiation culturelle",
    "Patrimoine"
  ],
  business: [
    "Entrepreneuriat",
    "Finance",
    "Marketing",
    "Vente",
    "Management",
    "Stratégie",
    "Comptabilité",
    "Ressources humaines",
    "Consulting",
    "E-commerce"
  ],
  maison: [
    "Décoration intérieure",
    "Bricolage",
    "Jardinage",
    "Cuisine",
    "Organisation",
    "Rénovation",
    "Design d'espace",
    "Menuiserie",
    "Plomberie",
    "Électricité"
  ],
  artisanat: [
    "Poterie",
    "Couture",
    "Tricot",
    "Bijouterie",
    "Menuiserie",
    "Sculpture",
    "Maroquinerie",
    "Céramique",
    "Tissage",
    "Gravure"
  ],
  glow: [
    "Coaching de vie",
    "Méditation",
    "Yoga",
    "Nutrition",
    "Fitness",
    "Beauté",
    "Développement personnel",
    "Sophrologie",
    "Aromathérapie",
    "Relaxation"
  ],
  sport: [
    "Fitness",
    "Musculation",
    "Course à pied",
    "Natation",
    "Tennis",
    "Football",
    "Basketball",
    "Yoga",
    "Pilates",
    "Arts martiaux"
  ]
};

/**
 * Fonction pour obtenir l'ID numérique d'un domaine
 */
export const getDomainNumericId = (domainId: string): number => {
  return DOMAIN_ID_MAPPING[domainId] || 0;
};