import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import StoryType from './Story';

export default shape({
  byId: objectOf(StoryType),
  allIds: arrayOf(number),
});
