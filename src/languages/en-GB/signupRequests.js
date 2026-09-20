export default {
  cTitle: 'Signup Requests',
  mTitle: 'Signup Requests',
  empty: 'Nobody is waiting.',
  restricted: {
    cTitle: 'Signup requests are restricted',
    cDescription: 'Administrators only.',
  },
  usernameTakenHint: 'This username has since been taken, so the request cannot be approved.',
  invited: 'Invited',
  fields: {
    note: 'Note',
  },
  actions: {
    approve: 'Approve',
    reject: 'Reject',
  },
  form: {
    noteHint: 'Optional. Kept for your records, not shown to them.',
  },
  confirmApprove: {
    cTitle: 'Approve this request?',
    cDescription: 'Creates an account for {{username}} and emails {{email}}.',
  },
  confirmReject: {
    cTitle: 'Reject this request?',
    cDescription: 'Refuses {{username}} and emails them.',
  },
  alerts: {
    approved: '{{username}} was approved',
    rejected: '{{username}} was rejected',
  },
  errors: {
    browse: 'The requests could not be loaded.',
    approve: 'The request could not be approved.',
    reject: 'The request could not be rejected.',
    // Says what to do instead, because retrying cannot work.
    usernameTaken: 'That username was taken while the request waited. Reject it and ask for another.',
    alreadyDecided: 'Another administrator has already answered this request.',
    notVerified: 'They have not confirmed their email address yet.',
  },
};
