export default {
  story: {
    title: 'Stories',
    description: 'Partagez des publications éphémères avec vos abonnés.',
    addPermissions: {},
  },
  feed: {
    title: "Fil d'actualité",
    description: 'Recevez les publications de votre graphe social par ordre chronologique.',
    addPermissions: {},
  },
  socialgraph: {
    title: 'Graphe social',
    description: 'Consultez votre graphe social et gérez vos abonnés.',
    addPermissions: {
      title: 'Autorisations',
      follower: 'Qui peut ajouter un abonné ?',
    },
  },
  text: {
    title: 'Texte',
    description: 'Publications textuelles à partager avec vos abonnés.',
    addPermissions: {
      title: 'Autorisations',
      note: 'Qui peut publier une note ?',
      comment: 'Qui peut commenter ?',
      like: 'Qui peut aimer ?',
    },
  },
  photo: {
    title: 'Photos',
    description: 'Partagez vos photos avec vos abonnés.',
    addPermissions: {
      title: 'Autorisations',
      photo: 'Qui peut publier une photo ?',
      comment: 'Qui peut commenter ?',
      like: 'Qui peut aimer ?',
    },
  },
};
