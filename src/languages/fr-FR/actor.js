export default {
  about: 'À propos',
  name: 'Nom',
  alias: 'Alias',
  website: 'Site web',
  body: 'Description',
  unknown: 'Inconnu',
  delete: {
    prompts: {
      challenge: "Saisissez l'alias exact : {{ alias }}",
      inProgress: 'Suppression en cours ...',
    },
    errors: {
      generic: 'Impossible de supprimer ce profil. Veuillez réessayer.',
      forbidden: 'Vous n\'avez pas la permission de supprimer ce profil.',
    },
  },
  access: {
    content: 'Ce profil sera visible publiquement. Voulez-vous continuer ?',
    labels: {
      whoCanSee: 'Qui peut voir ce profil ?',
      othersCanRequestToFollow: "Les autres peuvent demander à s'abonner",
      whoCanAddFollowers: 'Qui peut ajouter des abonnés ?',
    },
  },
};
