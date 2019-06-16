import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import LocationType from './Location';

export default shape({
  byId: objectOf(LocationType),
  allIds: arrayOf(number),
});
