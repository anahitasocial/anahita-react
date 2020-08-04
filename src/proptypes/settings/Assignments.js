import {
  shape,
  objectOf,
  arrayOf,
  string,
} from 'prop-types';

import AssignmentType from './Assignment';

export default shape({
  byId: objectOf(AssignmentType),
  allIds: arrayOf(string),
});
