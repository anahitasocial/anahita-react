export default {
  cTitle: 'Invitations',
  mTitle: 'Invitations',
  empty: 'Aucune invitation envoyée.',
  restricted: {
    cTitle: 'Les invitations sont réservées',
    cDescription: 'Administrateurs uniquement.',
  },
  fields: {
    recipientEmail: 'Courriel',
  },
  status: {
    pending: 'En attente',
    used: 'Acceptée',
    expired: 'Expirée',
  },
  actions: {
    add: 'Inviter quelqu’un',
    send: "Envoyer l'invitation",
    revoke: 'Révoquer',
    revokeFor: "Révoquer l'invitation envoyée à {{email}}",
  },
  form: {
    cTitle: 'Inviter quelqu’un',
    cDescription: 'La personne recevra un courriel avec un lien pour nous rejoindre.',
  },
  confirmRevoke: {
    cTitle: 'Révoquer cette invitation ?',
    cDescription: 'Le lien envoyé à {{email}} cessera de fonctionner, et la personne sera prévenue du retrait.',
  },
  alerts: {
    sent: 'Une invitation a été envoyée à {{email}}',
    revoked: "L'invitation envoyée à {{email}} a été révoquée",
  },
  errors: {
    browse: "Les invitations n'ont pas pu être chargées.",
    add: "L'invitation n'a pas pu être envoyée.",
    delete: "L'invitation n'a pas pu être révoquée.",
    conflict: "Cette adresse possède déjà un compte, ou vous avez trop d'invitations en attente.",
    forbidden: "Ce site n'émet pas d'invitations.",
    rateLimited: "Trop d'invitations récemment. Réessayez plus tard.",
  },
};
