import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import PermissionType from './Permission';

export default shape({
  byId: objectOf(PermissionType),
  allIds: arrayOf(number),
});
