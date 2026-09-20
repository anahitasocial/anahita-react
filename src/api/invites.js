import axios from 'axios';

// The viewer's own invites. Administrator or super admin to browse;
// where a site lets other people invite, any registered person may
// issue one and revoke their own, which is why the server checks
// CanDeleteOwn rather than CanDelete.
//
// browse is scoped to the viewer BY THE SERVER, on created_by. Not a
// filter this module applies and not one it can be talked out of —
// an invite row carries the address it was sent to, and reading
// somebody else's is not part of being allowed to send your own.
//
// Invite ids are STRINGS. auth-service formats the token id with
// strconv.FormatInt on the way out while every other entity sends a
// number. Left as it is on purpose — the accept flow's callers already
// read it that way — so the proptype says string and nothing here
// coerces it.

const browse = (params = {}) => {
  const { limit = 20, offset = 0 } = params;
  return axios.get('/invites', {
    params: { limit, offset },
  });
};

// Sends the invitation mail as well as minting the token. Several
// refusals are worth telling apart, and all of them are ordinary:
//
//   409 — either that address already has an account, or the inviter is
//         at their cap of outstanding invitations (the body says which,
//         and how a slot frees)
//   403 — registration is `closed`, which suspends invitations too
//   429 — rate limited, per inviter or per recipient
const add = (email) => {
  return axios.post('/invites', { email });
};

// Revokes the link and emails the invitee to say so. Freeing a slot
// against the cap is the documented way out for somebody who has spent
// theirs on mistyped addresses.
const deleteItem = (id) => {
  return axios.delete(`/invites/${id}`);
};

export default {
  browse,
  add,
  deleteItem,
};
