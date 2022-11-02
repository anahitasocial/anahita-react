export default {
  about: {
    mTitle: 'About',
    cTitle: 'About',
    apiVersion: 'API Version',
    clientVersion: 'Client Version',
    license: 'License',
    website: 'Website',
  },
  appAssignments: {
    mTitle: 'App Assignments',
    cTitle: 'App Assignments',
    cDescription: 'Manage items of apps to actors',
  },
  apps: {
    mTitle: 'Apps',
    cTitle: 'Apps',
  },
  app: {
    blogs: {
      ownerIds: 'Owner Ids',
      createdByIds: 'Created by Ids',
    },
    documents: {
      uploadlimit: 'Upload Limit',
      uploadlimitOptions: {
        '2Mb': '2 MB',
        '4Mb': '4 MB',
        '8Mb': '8 MB',
      },
    },
    groups: {
      canPublish: 'Can publish',
      canPublishOptions: {
        siteAdmins: 'Site Admins',
        siteAdminsRegisteredMembers: 'Site Admins, Registered Members',
      },
    },
    locations: {
      service: 'Service',
      apiKeyGeocoding: 'Geocoding API Key',
      apiKeyMaps: 'Maps API Key',
    },
    notifications: {
      useCron: 'Use Cron',
      useCronOptions: {
        no: 'No',
        yes: 'Yes',
      },
      muteEmail: 'Mute Email Notifications',
      muteEmailOptions: {
        no: 'No',
        yes: 'Yes',
      },
    },
    mailer: {
      debug: 'Debug Mailer',
      redirectEmail: 'Redirect Email',
      debugOptions: {
        no: 'No',
        yes: 'Yes',
      },
    },
    pages: {
      contentPath: 'Content path',
    },
    people: {
      allowRegistration: 'Allow guest users to sign up',
      allowRegistrationOptions: {
        no: 'No',
        yes: 'Yes',
      },
      access: 'Default Access',
      accessOptions: {
        libAnPrivacylabelPublic: 'Public',
        libAnPrivacylabelRegistered: 'Registered',
      },
    },
    photos: {
      uploadlimit: 'Upload Limit',
      uploadlimitOptions: {
        '2Mb': '2 MB',
        '4Mb': '4 MB',
        '8Mb': '8 MB',
        '10Mb': '10 MB',
      },
    },
    subscriptions: {
      login: 'Paypal Login',
      password: 'Paypal Password',
    },
  },
  assignment: {
    options: {
      always: 'Always',
      optional: 'Optional',
      never: 'Never',
    },
  },
  plugins: {
    mTitle: 'Plugins',
    cTitle: 'Plugins',
  },
  plugin: {
    local: {
      storage: {
        folder: 'Local storage folder',
      },
    },
    s3: {
      storage: {
        folder: 'S3 storage folder',
        region: 'Region',
        regionOptions: {
          asiaPacificHongKong: 'Asia Pacific, Hong Kong',
          asiaPacificMumbai: 'Asia Pacific, Mumbai',
          asiaPacificOsakaLocal: 'Asia Pacific, Osaka Local',
          asiaPacificSeoul: 'Asia Pacific, Seoul',
          asiaPacificSingapore: 'Asia Pacific, Singapore',
          asiaPacificSydney: 'Asia Pacific, Sydney',
          asiaPacificTokyo: 'Asia Pacific, Tokyo',
          canadaCentral: 'Canada, Central',
          chinaBeijing: 'China, Beijing',
          chinaNingxia: 'China, Ningxia',
          euFrankfurt: 'EU, Frankfurt',
          euIreland: 'EU, Ireland',
          euLondon: 'EU, London',
          euParis: 'EU, Paris',
          euStockholm: 'EU, Stockholm',
          middleEastBahrain: 'Middle East, Bahrain',
          southAmericaSaoPaulo: 'South America, Sao Paulo',
          usEastNVirginiaAwsDefault: 'US East, N. Virginia (AWS Default)',
          usEastOhio: 'US East, Ohio',
          usWestNCalifornia: 'US West, N. California',
          usWestOregon: 'US West, Oregon',
        },
        bucket: 'Bucket',
        accessKey: 'Access Key',
        secretKey: 'Secret Key',
      },
    },
  },
};
