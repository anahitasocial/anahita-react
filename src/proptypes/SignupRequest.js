import {
  shape,
  number,
  string,
  bool,
} from 'prop-types';

// One pending application to join, as an administrator sees it.
//
// No password and no token, deliberately — the row holds a password
// hash because approval needs it, and auth-service's response struct
// leaves it out so a queue never serialises credentials.
//
// usernameTaken is computed per read rather than stored, because it
// changes while a request waits: somebody else can register the name
// between the application and the decision. Shown in the queue so an
// administrator knows before they click, rather than finding out from
// a 409 after.
export default shape({
  id: number,
  username: string,
  email: string,
  name: string,
  body: string,
  websiteUrl: string,
  status: string,
  // Present only when the application came from an invitation.
  invitedBy: number,
  createdIp: string,
  createdAt: string,
  usernameTaken: bool,
});
