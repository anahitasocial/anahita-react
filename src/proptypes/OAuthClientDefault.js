// A blank client, as the add form starts.
//
// tokenExpiry is 900 rather than 0 because the server's validator
// accepts 300..86400 and zero is not in that range; a form seeded with
// the type's zero value would be invalid before anybody touched it.
//
// active defaults on. Somebody filling in this form is registering a
// client they intend to use, and a registration that silently arrives
// switched off fails at authorize time with nothing pointing back here.
export default {
  id: 0,
  clientId: '',
  name: '',
  redirectUris: [],
  grantTypes: [],
  scopes: [],
  tokenExpiry: 900,
  confidential: false,
  skipConsent: false,
  firstParty: true,
  active: true,
  createdAt: '',
};
