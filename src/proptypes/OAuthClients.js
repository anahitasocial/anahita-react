import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import OAuthClient from './OAuthClient';

export default shape({
  byId: objectOf(OAuthClient),
  allIds: arrayOf(number),
});
