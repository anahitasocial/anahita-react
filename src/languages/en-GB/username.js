export default {
  mTitle: 'Username',
  cTitle: 'Username',
  title: 'Username',
  description: 'Your username signs you in and forms your profile address. Changing it releases the old one, and links to your old profile address will stop working.',
  changed: 'Your username is now {{username}}. A confirmation email has been sent.',
  change: 'Change username',
  fields: {
    current: 'Current username',
    new: 'New username',
  },
  helper: 'Letters, numbers, hyphens and underscores only.',
  submit: 'Change username',
  submitting: 'Changing…',
  errors: {
    required: 'Enter a new username.',
    tooShort: 'Username must be at least {{count}} characters.',
    tooLong: 'Username must be no more than {{count}} characters.',
    invalid: 'Use letters, numbers, hyphens and underscores only.',
    sameAsCurrent: 'That is already your username.',
    taken: 'That username is already taken.',
    generic: 'Could not change your username. Please try again.',
  },
};
