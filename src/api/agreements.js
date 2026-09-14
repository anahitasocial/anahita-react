import axios from 'axios';

// Accepting the legal documents, one at a time.
//
// The version sent is the one in statics/legal/index.js. The server records it,
// and records the when and the from-where itself — those never come from here.
//
// No person id in the path: the server acts on whoever is signed in, so there
// is nobody else's acceptance this could record.

const editTos = (version) => {
  return axios.patch('/agreements/tos', { version, accepted: true });
};

const editPrivacy = (version) => {
  return axios.patch('/agreements/privacy', { version, accepted: true });
};

export default {
  editTos,
  editPrivacy,
};
