export default {
  cTitle: 'Personnes',
  mTitle: 'Personnes',
  add: {
    cTitle: 'Ajouter une personne',
    mTitle: 'Ajouter une personne',
  },
  settings: {
    authlogs: 'Authentifications',
    webauthn: 'Clés d’accès',
    totp: '2FA',
    info: 'Infos',
    features: 'Fonctionnalités',
    permissions: 'Autorisations',
    access: 'Accès',
    delete: 'Supprimer',
    deletePrompts: {
      description: 'La suppression retire ce profil et tout ce qu\'il contient : publications, commentaires, photos, abonnés et adhésions aux groupes. Les commentaires laissés par d\'autres personnes sur ce contenu sont également supprimés.',
      reversible: 'Ce n\'est pas immédiat. Le profil est masqué aussitôt puis définitivement effacé après {{ count }} jours. En vous connectant avant cette date, vous pourrez le restaurer.',
      revoked: 'Les sessions sur tous les appareils prennent fin immédiatement et les clés d\'accès sont supprimées. La restauration ne les rétablit pas.',
      handle: 'Le nom {{ alias }} reste réservé, personne d\'autre ne pourra le prendre.',
      scheduled: 'Ce profil est programmé pour suppression. Connectez-vous avant le {{ date }} pour le restaurer.',
    },
    notifications: 'Paramètres de notification',
    followRequests: "Demandes d'abonnement",
    // These three were missing while en-GB had them, so the password, email
    // and username cards rendered their raw key names in French.
    password: 'Mot de passe',
    email: 'E-mail',
    username: "Nom d'utilisateur",
    // Section labels for the grouped person settings page.
    sections: {
      account: 'Compte',
      security: 'Sécurité',
      privacy: 'Confidentialité',
      danger: 'Zone de danger',
    },
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
  person: {
    givenName: 'Prénom',
    familyName: 'Nom',
    username: "Nom d'utilisateur",
    email: 'E-mail',
    body: 'Bio',
    pronouns: 'Pronoms',
    whatPronouns: 'Quels pronoms utilisez-vous ?',
    pronounOptions: {
      feminine: 'Féminin',
      masculine: 'Masculin',
      nonbinary: 'Non binaire',
    },
    usertype: "Type d'utilisateur",
    usertypeOptions: {
      guest: 'Invité',
      registered: 'Inscrit',
      administrator: 'Administrateur',
      'super-administrator': 'Super administrateur',
    },
    joinedDate: 'Membre depuis le {{ date }}',
    lastVisitOn: 'Dernière visite le {{ date }}',
  },
  confirm: {
    delete: 'Voulez-vous supprimer le profil de {{ name }} ?',
    block: 'Voulez-vous bloquer le profil de {{ name }} ?',
  },
  account: {
    prompts: {
      error: 'Une erreur est survenue !',
      errorUsernameTaken: "Ce nom d'utilisateur est déjà pris !",
      errorEmailTaken: 'Cette adresse e-mail est déjà utilisée dans notre système !',
    },
  },
};
