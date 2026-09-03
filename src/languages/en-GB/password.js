export default {
  mTitle: 'Password',
  cTitle: 'Password',
  cDesc: 'Change the password you use to sign in.',
  description: 'Your new password must be at least {{count}} characters long. Use a unique passphrase that you don\'t use elsewhere.',
  fields: {
    new: 'New password',
  },
  toggle: {
    show: 'Show password',
    hide: 'Hide password',
  },
  submit: 'Update password',
  update: 'Update',
  submitting: 'Updating…',
  success: 'Your password has been updated. A confirmation email has been sent.',
  // Plural keys are `key` + `key_plural`, not `_one`/`_other`. The
  // `_one`/`_other` suffixes arrived with i18next v21's JSON v4; this
  // app runs i18next 17, which resolves count === 1 to the bare key and
  // everything else to `_plural`. Under v17 an `_other` key is never
  // looked up, so the toast rendered the literal string
  // 'successSessions' instead of a sentence.
  successSessions: 'Your password has been updated and {{count}} other session was signed out. A confirmation email has been sent.',
  successSessions_plural: 'Your password has been updated and {{count}} other sessions were signed out. A confirmation email has been sent.',
  errors: {
    newRequired: 'Enter a new password.',
    newTooShort: 'New password must be at least {{count}} characters.',
    newTooLong: 'New password must be no more than {{count}} characters.',
    reused: 'Your new password must be different from your current password.',
    generic: 'Could not update your password. Please try again.',
    // No duration named. The server's window is 15 minutes today
    // (rateLimitScopePasswordEdit), but a number repeated here goes
    // stale silently the moment that constant is tuned, and a promise
    // of "30 minutes" that is really 15 is worse than no promise.
    tooMany: 'Too many attempts. Please wait a few minutes and try again.',
  },
};
