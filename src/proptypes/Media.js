import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import MediaType from './Medium';

export default shape({
  byId: objectOf(MediaType),
  allIds: arrayOf(number),
});
