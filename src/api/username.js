import axios from 'axios';

// Change the signed-in person's username.
//
// TAKES ONLY THE HANDLE. requests.UsernameChangeEdit accepts nothing
// else — re-authentication happens separately at /reauth/*, which
// records a short-lived marker the endpoint checks. Same contract as
// api/email.js.
//
// Applies immediately, unlike the email change: a handle move relocates
// no recovery path, so there is nothing for the person's mailbox to
// approve first. A notification is mailed after the fact.
//
// Responses: 200 changed (body carries the stored handle), 204 the
// handle was already theirs, 400 invalid, 403 no recent step-up (the
// caller re-authenticates and retries), 409 taken.
function edit(params) {
  const { username } = params;
  return axios.patch('username/change', {
    username,
  });
}

export default {
  edit,
};
