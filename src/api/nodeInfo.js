import publicClient from './publicClient';

// NodeInfo — what this installation says about itself.
//
// http://nodeinfo.diaspora.software/protocol.html
//
// Two hops by protocol: the well-known document is a list of links, and a
// consumer follows the schema version it understands. Followed properly rather
// than hard-coding /nodeinfo/2.1, because the indirection is the point — a
// server may move the document or publish several versions, and a client that
// skips the first hop breaks when it does.
//
// This is where "can somebody sign up here?" is answered. It replaces
// REACT_APP_SIGNUP_CLOSED, which was an opinion held by the browser: it hid a
// tab while the endpoint behind it stayed open to anybody who looked.

const SCHEMA_2_1 = 'http://nodeinfo.diaspora.software/ns/schema/2.1';

const read = () => {
  return publicClient.get('/.well-known/nodeinfo').then((response) => {
    const links = (response.data && response.data.links) || [];
    const link = links.find((candidate) => {
      return candidate.rel === SCHEMA_2_1;
    });

    if (!link) {
      throw new Error('no NodeInfo 2.1 document is published');
    }

    return publicClient.get(link.href);
  });
};

export default {
  read,
};
