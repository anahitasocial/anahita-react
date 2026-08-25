export default {
  cTitle: 'Please log in',
  mTitle: 'Login',
  logout: 'Logout',
  login: 'Please log in',
  username: 'Email or Username',
  password: 'Password',
  forgotPassword: 'Forgot password?',
  passwordResetEmail: 'What is your email?',
  actions: {
    resetPassword: 'Reset password',
  },
  signup: {
    cTitle: 'Please signup',
    mTitle: 'Signup',
    firstName: 'First name',
    lastName: 'Last name',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    actions: {
      signup: 'Signup',
    },
  },
  authLogs: {
    cTitle: 'Authentications',
    cDesc: '{{ name }} on a {{ device }} running {{ os }} from {{ city }} {{ country }}',
    cActive: 'Active now',
    actions: {
      forceLogout: 'Force Logout',
    },
  },
  webauthn: {
    cTitle: 'Passkeys',
    cDesc: 'Sign in with your fingerprint, face, or device PIN instead of your password',
    add: 'Add a passkey',
    adding: 'Waiting for your device…',
    empty: {
      platform: 'Add a passkey to sign in with your fingerprint, face, or device PIN — no password, no verification code.',
      roaming: 'Add a passkey to sign in without your password. You can use a security key, or scan a code with your phone.',
      fallback: 'Your password and verification code would still keep working, so you can always sign in another way.',
    },
    credential: {
      lastUsed: 'Last used {{ when }}',
      neverUsed: 'Never used',
      added: 'Added {{ date }}',
      synced: 'Synced across devices',
      deviceOnly: 'This device only',
      cloneWarning: 'This passkey reported unexpected activity. Remove it and add a new one.',
      actions: {
        rename: 'Rename {{ name }}',
        remove: 'Remove {{ name }}',
      },
    },
    renameDialog: {
      title: 'Rename passkey',
      message: 'Give this passkey a name that tells you which device it\'s on.',
    },
    removeDialog: {
      title: 'Remove this passkey?',
      message: 'You won\'t be able to sign in with {{ name }} any more. Your password and verification code still work.',
    },
    nickname: {
      label: 'Name',
      counter: '{{ count }}/{{ max }}',
    },
    alerts: {
      added: '{{ name }} is ready to use.',
      removed: '{{ name }} was removed.',
      atLimit: 'You\'ve reached the maximum of {{ max }} passkeys. Remove one to add another.',
      unsupported: 'This browser can\'t use passkeys. You can still sign in with your password and verification code.',
      browseError: 'We couldn\'t load your passkeys. Refresh to try again.',
      renameError: 'We couldn\'t rename that passkey. Try again.',
      removeError: 'We couldn\'t remove that passkey. Try again.',
    },
    ceremonyErrors: {
      alreadyRegistered: 'This device already has a passkey for your account.',
      cancelled: 'Setup was cancelled. Try again when you\'re ready.',
      insecureContext: 'This page can\'t create passkeys. Contact support if this keeps happening.',
      atLimit: 'You\'ve reached the maximum number of passkeys. Remove one first.',
      expired: 'That took too long. Try again.',
      generic: 'We couldn\'t add that passkey. Try again.',
    },
  },
  totp: {
    cTitle: 'Two-Factor Auth',
    cDesc: 'Enable two-factor authentication and pair your account with an authenticator app of your choice on your mobile device.',
    disableDialog: {
      title: 'Are you sure?',
      message: 'You are about to disable your Two-Factor authentication. This action will reduce the security of your account. Do you still want to proceed?',
    },
    steps: {
      cTitle: 'Set up two-factor authentication',
      pairDevice: 'Pair device',
      downloadRecoveryCodes: 'Recovery codes',
      enabled: 'Enabled',
    },
    password: {
      title: 'Confirm your password',
      label: 'Password',
    },
    pairing: {
      cTitle: 'Setup authenticator app',
      cDesc: 'Use a phone app like Authy, Google Authenticator, or Microsoft Authenticator, etc. to get 2FA codes when prompted during sign-in.',
    },
    qrCode: {
      cTitle: 'Scan the QR code',
      cDesc: 'Use your authenticator app to scan the QR code and pair it with your account',
      passcode: {
        title: 'Verify the code',
        label: 'Enter the current code from your authenticator app',
      },
    },
    recoveryCodes: {
      cTitle: 'Download your recovery codes',
      cDesc: 'You can use recovery codes as a second factor to authenticate in case you lose access to your device. We recommend saving them with a secure password manager such as 1Password or Keeper.',
      warning: 'Keep your recovery codes in a safe spot. If you lose your device and cannot find your recovery codes, you will lose access to your account.',
      content: 'RECOVERY CODES\n\nService: {{ service }}\nAccount: {{ account }}\n\n*You can only use each code ONCE!*\n\n',
      prompts: {
        copySuccess: 'Copy Success!',
        copyCodes: 'Copy codes',
        enableTotp: 'I have saved my recovery codes',
      },
    },
    enable: {
      cDesc: 'You have enabled two-factor authentication using authenticator app.',
    },
    verify: {
      cTitle: 'Two-Factor Auth',
      cDesc: 'Enter the current code from your authenticator app to finish signing in.',
      passcode: 'Verification code',
    },
    widget: {
      cTitle: 'Security Reminder',
      cSubTitle: '2FA is not enabled!',
      cDesc: 'Enabling Two-Factor Auth (2FA) and using an Authenticator app will make your account a lot more secure.',
      action: 'Setup 2FA',
    },
    errors: {
      wrongPassword: 'That password is not correct. Try again.',
      passwordInvalid: 'We couldn\'t verify your password. Try again.',
      invalidPasscode: 'That code is not valid. Check your authenticator app and try again.',
      enableFailed: 'We couldn\'t enable two-factor authentication. Try again.',
    },
  },
  prompts: {
    error: 'Something went wrong!',
    errorSignupUsernameTaken: 'Username is already taken!',
    errorSignupEmailTaken: 'Email is already available in our system!',
    errorTokenInvalid: 'This is an invalid token!',
    passwordResetEmailSuccess: 'We emailed you a link. Please click on that link and follow the instructions!',
    signupEmailSuccess: 'Thank you! We just emailed you an account activation link.',
  },
};
