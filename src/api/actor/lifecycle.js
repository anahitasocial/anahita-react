import axios from 'axios';

// Archive: permanent, and destroys nothing.
//
// The content keeps its URLs forever; what stops is the actor being live. A
// person can no longer sign in, and a group leaves search along with its posts.
//
// There is no unarchive, and that is the design rather than a gap — see the
// services. So the caller must treat a success here as final.
const archive = (namespace) => {
  return (actor) => {
    return axios.post(`/${namespace}/${actor.id}/archive`);
  };
};

// Enable or disable: the reversible one.
//
// PATCH rather than POST because it sets a value that can be set back, which is
// the whole distinction between this and the two beside it.
const setEnabled = (namespace) => {
  return (actor, enabled) => {
    return axios.patch(`/${namespace}/${actor.id}/enabled`, { enabled });
  };
};

export default (namespace) => {
  return {
    archive: archive(namespace),
    setEnabled: setEnabled(namespace),
  };
};
