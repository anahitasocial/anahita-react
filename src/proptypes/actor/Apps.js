import {
  shape,
  objectOf,
  arrayOf,
  string,
} from 'prop-types';

import AppType from './App';

export default shape({
  byId: objectOf(AppType),
  allIds: arrayOf(string),
});
