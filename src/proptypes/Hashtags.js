import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import HashtagType from './Hashtag';

export default shape({
  byId: objectOf(HashtagType),
  allIds: arrayOf(number),
});
