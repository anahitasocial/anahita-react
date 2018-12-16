import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import ActorType from './Actor';

export default shape({
  byId: objectOf(ActorType),
  allIds: arrayOf(number),
});
