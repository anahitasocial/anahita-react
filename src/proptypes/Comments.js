import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import CommentType from './Comment';

export default shape({
  byId: objectOf(CommentType),
  allIds: arrayOf(number),
});
