import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import PersonType from './Person';

export default shape({
  byId: objectOf(PersonType),
  allIds: arrayOf(number),
});
