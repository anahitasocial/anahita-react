import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import NodeType from './Node';

export default shape({
  byId: objectOf(NodeType),
  allIds: arrayOf(number),
});
