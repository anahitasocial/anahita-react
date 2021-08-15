import {
  shape,
  objectOf,
  arrayOf,
  number,
} from 'prop-types';

import NotificationType from './Notification';

export default shape({
  byId: objectOf(NotificationType),
  allIds: arrayOf(number),
});
