export default {
  cTitle: 'Paramètres',
  mTitle: 'Paramètres',
  about: {
    mTitle: 'À propos',
    cTitle: 'À propos',
    apiVersion: "Version de l'API",
    clientVersion: 'Version du client',
    license: 'Licence',
    website: 'Site web',
  },
  appAssignments: {
    mTitle: "Attributions d'applications",
    cTitle: "Attributions d'applications",
    cDescription: "Gérer l'attribution des applications aux profils",
  },
  apps: {
    mTitle: 'Applications',
    cTitle: 'Applications',
  },
  app: {
    blogs: {
      ownerIds: 'Identifiants des propriétaires',
      createdByIds: 'Identifiants des créateurs',
    },
    documents: {
      uploadlimit: 'Limite de téléversement',
      uploadlimitOptions: {
        '2Mb': '2 Mo',
        '4Mb': '4 Mo',
        '8Mb': '8 Mo',
      },
    },
    groups: {
      canPublish: 'Peut publier',
      canPublishOptions: {
        siteAdmins: 'Administrateurs du site',
        siteAdminsRegisteredMembers: 'Administrateurs du site, membres inscrits',
      },
    },
    locations: {
      service: 'Service',
      apiKeyGeocoding: 'Clé API de géocodage',
      apiKeyMaps: 'Clé API Maps',
    },
    notifications: {
      useCron: 'Utiliser Cron',
      useCronOptions: {
        no: 'Non',
        yes: 'Oui',
      },
      muteEmail: 'Désactiver les notifications par e-mail',
      muteEmailOptions: {
        no: 'Non',
        yes: 'Oui',
      },
    },
    mailer: {
      debug: 'Déboguer le service de messagerie',
      redirectEmail: 'Rediriger les e-mails',
      debugOptions: {
        no: 'Non',
        yes: 'Oui',
      },
    },
    pages: {
      contentPath: 'Chemin du contenu',
    },
    people: {
      allowRegistration: "Autoriser les visiteurs à s'inscrire",
      allowRegistrationOptions: {
        no: 'Non',
        yes: 'Oui',
      },
      access: 'Accès par défaut',
      accessOptions: {
        libAnPrivacylabelPublic: 'Public',
        libAnPrivacylabelRegistered: 'Membres inscrits',
      },
    },
    photos: {
      uploadlimit: 'Limite de téléversement',
      uploadlimitOptions: {
        '2Mb': '2 Mo',
        '4Mb': '4 Mo',
        '8Mb': '8 Mo',
        '10Mb': '10 Mo',
      },
    },
    subscriptions: {
      login: 'Identifiant Paypal',
      password: 'Mot de passe Paypal',
    },
  },
  assignment: {
    options: {
      always: 'Toujours',
      optional: 'Facultatif',
      never: 'Jamais',
    },
  },
  plugins: {
    mTitle: 'Extensions',
    cTitle: 'Extensions',
  },
  plugin: {
    local: {
      storage: {
        folder: 'Dossier de stockage local',
      },
    },
    s3: {
      storage: {
        folder: 'Dossier de stockage S3',
        region: 'Région',
        regionOptions: {
          asiaPacificHongKong: 'Asie-Pacifique, Hong Kong',
          asiaPacificMumbai: 'Asie-Pacifique, Mumbai',
          asiaPacificOsakaLocal: 'Asie-Pacifique, Osaka Local',
          asiaPacificSeoul: 'Asie-Pacifique, Séoul',
          asiaPacificSingapore: 'Asie-Pacifique, Singapour',
          asiaPacificSydney: 'Asie-Pacifique, Sydney',
          asiaPacificTokyo: 'Asie-Pacifique, Tokyo',
          canadaCentral: 'Canada, Centre',
          chinaBeijing: 'Chine, Pékin',
          chinaNingxia: 'Chine, Ningxia',
          euFrankfurt: 'UE, Francfort',
          euIreland: 'UE, Irlande',
          euLondon: 'UE, Londres',
          euParis: 'UE, Paris',
          euStockholm: 'UE, Stockholm',
          middleEastBahrain: 'Moyen-Orient, Bahreïn',
          southAmericaSaoPaulo: 'Amérique du Sud, São Paulo',
          usEastNVirginiaAwsDefault: 'États-Unis Est, Virginie du Nord (par défaut AWS)',
          usEastOhio: 'États-Unis Est, Ohio',
          usWestNCalifornia: 'États-Unis Ouest, Californie du Nord',
          usWestOregon: 'États-Unis Ouest, Oregon',
        },
        bucket: 'Bucket',
        accessKey: "Clé d'accès",
        secretKey: 'Clé secrète',
      },
    },
  },
};
