import { arrayOf } from 'prop-types';

import OAuthClient from './OAuthClient';

// A plain list, not the normalizr { byId, allIds } shape the plural
// types for nodes use.
//
// Those exist because nodes go through createReducer and arrive
// normalised. OAuth clients do not: there are a handful of them, they
// never paginate, and the settings tabs hold them in local state the
// way the account screens hold passkeys and auth logs. Keeping the
// normalised shape here would describe a store entry nothing writes.
export default arrayOf(OAuthClient);
