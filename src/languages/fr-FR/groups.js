export default {
  cTitle: 'Groupes',
  mTitle: 'Groupes',
  add: {
    cTitle: 'Créer un groupe',
    mTitle: 'Créer un groupe',
  },
  settings: {
    info: 'Infos',
    admins: 'Administrateurs',
    features: 'Fonctionnalités',
    permissions: 'Autorisations',
    access: 'Accès',
    delete: 'Supprimer',
    deletePrompts: {
      counts: {
        intro: 'Dans ce groupe actuellement :',
        posts: '{{ count }} publication',
        posts_plural: '{{ count }} publications',
        comments: '{{ count }} commentaire',
        comments_plural: '{{ count }} commentaires',
        followers: '{{ count }} abonné',
        followers_plural: '{{ count }} abonnés',
        memberSince: 'Créé en {{ date }}.',
      },
      description: 'La suppression retire ce groupe et tout ce qu\'il contient : publications, photos, commentaires et la liste des membres. Le contenu apporté par les autres membres est également supprimé.',
      reversible: 'Ce n\'est pas immédiat. Le groupe est masqué aussitôt puis définitivement effacé après {{ count }} jours. Tout administrateur peut le restaurer depuis cette page avant cette date.',
      revoked: 'Les membres perdent l\'accès immédiatement et le groupe disparaît de leurs profils et de leurs fils.',
      handle: 'Le nom {{ alias }} reste réservé, aucun autre groupe ne pourra le prendre.',
      scheduled: 'Ce groupe est programmé pour suppression et sera effacé le {{ date }}.',
      restore: 'Restaurer ce groupe',
      restored: 'Ce groupe a été restauré.',
      errors: {
        restoreFailed: 'Impossible de restaurer ce groupe. Il a peut-être déjà été définitivement effacé.',
      },
    },
    // Labels the tab; the card inside it still reads "Delete".
    sections: {
      danger: 'Zone de danger',
    },
    notifications: 'Paramètres de notification',
    followRequests: "Demandes d'abonnement",
  },
  notifications: {
    cTitle: 'Notifications',
    cDescription: 'Modifiez vos paramètres de notification',
    mTitle: 'Notifications',
    email: 'Recevoir les notifications par e-mail',
    optionsTitle: 'Recevoir des notifications pour',
    options: {
      all: 'Toutes les publications',
      following: 'Uniquement les publications que vous suivez',
    },
  },
  confirm: {
    delete: 'Voulez-vous supprimer le profil de {{ name }} ?',
    block: 'Voulez-vous bloquer le profil de {{ name }} ?',
  },
};
