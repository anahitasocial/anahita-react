export default {
  cTitle: "Demandes d'inscription",
  mTitle: "Demandes d'inscription",
  empty: "Personne n'attend.",
  restricted: {
    cTitle: "Les demandes d'inscription sont réservées",
    cDescription: 'Administrateurs uniquement.',
  },
  usernameTakenHint: "Ce nom d'utilisateur a depuis été pris : la demande ne peut pas être approuvée.",
  invited: 'Invitée',
  fields: {
    note: 'Note',
  },
  actions: {
    approve: 'Approuver',
    reject: 'Refuser',
  },
  form: {
    noteHint: 'Facultative. Conservée pour vos archives, jamais montrée à la personne.',
  },
  confirmApprove: {
    cTitle: 'Approuver cette demande ?',
    cDescription: 'Crée un compte pour {{username}} et envoie un courriel à {{email}}.',
  },
  confirmReject: {
    cTitle: 'Refuser cette demande ?',
    cDescription: 'Refuse {{username}} et lui envoie un courriel.',
  },
  alerts: {
    approved: '{{username}} a été approuvé',
    rejected: '{{username}} a été refusé',
  },
  errors: {
    browse: "Les demandes n'ont pas pu être chargées.",
    approve: "La demande n'a pas pu être approuvée.",
    reject: "La demande n'a pas pu être refusée.",
    usernameTaken: "Ce nom d'utilisateur a été pris pendant l'attente. Refusez la demande et demandez-en un autre.",
    alreadyDecided: 'Un autre administrateur a déjà répondu à cette demande.',
    notVerified: "Cette personne n'a pas encore confirmé son adresse courriel.",
  },
};
