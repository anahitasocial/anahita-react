export default {
  mTitle: 'Email',
  cTitle: 'Email address',
  title: 'Email address',
  description: 'For your security, we will send a confirmation link to your current address. Your email will not change until you open that link and re-type the new address.',
  sent: 'Check {{email}} for a confirmation link. It expires in 15 minutes.',
  change: 'Change email',
  fields: {
    current: 'Current email address',
    new: 'New email address',
  },
  submit: 'Send confirmation',
  submitting: 'Sending…',
  errors: {
    required: 'Enter a new email address.',
    invalid: 'Enter a valid email address.',
    sameAsCurrent: 'That is already your email address.',
    taken: 'That email address is already in use.',
    generic: 'Could not start the email change. Please try again.',
  },
};
