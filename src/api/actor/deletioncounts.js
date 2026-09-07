import axios from 'axios';

// What deleting this profile would cost — posts, comments, followers,
// following, groups administered, and how long they have been a member.
//
// Read when the Danger zone opens, not when the page loads. It is only ever
// used by the confirmation, and a count nobody is about to act on is a query
// nobody needed.
//
// Gated server-side on the same permission as the deletion itself, so a viewer
// who may not delete this profile gets a 403 here too. The caller renders the
// dialog without the figures rather than blocking on them.
const read = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/deletion-counts`);
  };
};

export default (namespace) => {
  return {
    read: read(namespace),
  };
};
