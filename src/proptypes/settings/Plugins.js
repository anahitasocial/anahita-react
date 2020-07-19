import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import AppType from './App';

export default shape({
  byId: objectOf(AppType),
  allIds: arrayOf(number),
});
