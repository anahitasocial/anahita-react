export default {
  about: 'À propos',
  name: 'Nom',
  alias: 'Alias',
  website: 'Site web',
  body: 'Description',
  unknown: 'Inconnu',
  delete: {
    prompts: {
      challenge: 'Tapez {{ alias }} pour confirmer',
      inProgress: 'Suppression en cours ...',
    },
    errors: {
      generic: 'Impossible de supprimer ce profil. Veuillez réessayer.',
      forbidden: 'Vous n\'avez pas la permission de supprimer ce profil.',
      lastSuperAdmin: 'Il s\'agit du seul super administrateur. Promouvez quelqu\'un d\'autre, ou changez ce compte en administrateur, avant de le supprimer.',
    },
  },
  access: {
    title: 'Accès',
    cDescription: 'Qui peut voir ce profil.',
    descriptions: {
      public: 'Tout le monde, connecté ou non.',
      registered: 'Toute personne ayant un compte ici.',
      followers: 'Les personnes abonnées à ce profil.',
      leaders: 'Les personnes suivies par ce profil.',
      mutuals: 'Les personnes abonnées à ce profil et suivies en retour.',
      admins: 'Les administrateurs de ce groupe.',
      myself: 'Personne d’autre.',
    },
    labels: {
      whoCanSee: 'Qui peut voir ce profil ?',
      othersCanRequestToFollow: "Les autres peuvent demander à s'abonner",
      whoCanAddFollowers: 'Qui peut ajouter des abonnés ?',
    },
    alerts: {
      success: "L'accès a été mis à jour",
      error: "L'accès n'a pas pu être mis à jour.",
    },
  },
};
