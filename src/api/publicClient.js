import axios from 'axios';
import utils from '../utils';

// An axios instance for PUBLIC DISCOVERY DOCUMENTS: NodeInfo, the OIDC
// configuration, and JWKS.
//
// It exists for one reason — it sends no credentials. The global
// instance sets `withCredentials = true` for everything, and these
// three endpoints answer `Access-Control-Allow-Origin: *`, which is
// correct for documents their specifications require to be
// world-readable. A browser REFUSES a credentialed request against a
// wildcard origin, so the combination fails in the browser however the
// server is configured.
//
// That is not a theoretical conflict. From the dev server on :3000 it
// took out every NodeInfo read at once — the login page, /support, the
// settings About tab and the invite level the left menu gates on — and
// the two OAuth settings screens degraded silently to their fallbacks.
// Same-origin production deployments never hit it, which is what let it
// sit unnoticed.
//
// Sending cookies to them would be wrong even if it worked: none of the
// three reads a session, and a JWKS request is something we would like
// any relying party to be able to make.
const publicClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: false,
});

// Instances made with axios.create inherit defaults but NOT
// interceptors, so the global camelCase conversion has to be repeated
// here. It is not decoration: the OIDC document is snake_case on the
// wire — scopes_supported, grant_types_supported — and the client form
// reads scopesSupported. Dropping this leaves the scope picker empty
// with nothing to explain why.
//
// api/reauth.js has its own instance for the opposite reason: WebAuthn
// payload keys are protocol constants and must NOT be rewritten.
publicClient.interceptors.response.use((response) => {
  if (response.data) {
    return {
      ...response,
      data: utils.api.camelCaseKeys(response.data),
    };
  }

  return response;
});

export default publicClient;
