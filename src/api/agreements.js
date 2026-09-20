import axios from 'axios';

// Accepting the legal documents, one at a time.
//
// The version sent is the one in statics/legal/index.js. The server records it,
// and records the when and the from-where itself — those never come from here.
//
// No person id on the two writes: the server acts on whoever is signed
// in, so there is nobody else's acceptance they could record. Reading
// takes one, because an acceptance is meaningful to its subject and to
// an administrator checking who is behind on the current terms.

// read returns { data: { tos, privacy } }, each { accepted, version,
// acceptedAt }.
//
// Not the IP, user agent or OS the row also holds. Those exist for
// "who accepted this, and from where" — a question asked by somebody
// reading a row, not by a settings card, and not one worth putting a
// person's address on screen to answer.
const read = (personId) => {
  return axios.get(`/agreements/${personId}`);
};

const editTos = (version) => {
  return axios.patch('/agreements/tos', { version, accepted: true });
};

const editPrivacy = (version) => {
  return axios.patch('/agreements/privacy', { version, accepted: true });
};

export default {
  read,
  editTos,
  editPrivacy,
};
