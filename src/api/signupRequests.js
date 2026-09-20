import axios from 'axios';

// The approval queue behind REGISTRATION_MODE=approval.
//
// Administrator or super admin, not super admin alone — these routes
// reuse auth-service's Perms.Invite, whose CanBrowse/CanAdd/CanDelete
// all test IsAdminOrSuperAdmin.
//
// Browse returns only PENDING requests, oldest first. Decided ones are
// kept in the table for the record but never come back here, so the
// list is the work outstanding rather than a history.

const browse = (params = {}) => {
  const { limit = 20, offset = 0 } = params;
  return axios.get('/signup-requests', {
    params: { limit, offset },
  });
};

// Creates the account: the actor first, then the credential row, with a
// compensating purge if the second fails. `note` is recorded against
// the decision and is not shown to the applicant.
//
// 409 `username_taken` is the case worth handling rather than reporting
// as a generic failure: a request can sit in the queue for days, and
// the name it asked for can be taken by somebody else in the meantime.
// The server re-checks at approval for exactly this reason, and the
// browse payload carries `usernameTaken` so the queue can warn before
// anybody clicks.
const approve = (id, note = '') => {
  return axios.post(`/signup-requests/${id}/approve`, { note });
};

// Records the refusal, stamps the deciding administrator and emails the
// applicant. 409 `already_decided` means somebody else answered it
// first; 409 `not_verified` means they have not confirmed their address
// and the request was never really in the queue.
const reject = (id, note = '') => {
  return axios.post(`/signup-requests/${id}/reject`, { note });
};

export default {
  browse,
  approve,
  reject,
};
