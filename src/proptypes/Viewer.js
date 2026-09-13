import {
  shape,
  number,
  string,
  oneOf,
} from 'prop-types';

import PERSON from '../constants/person';
import ImageUrls from './ImageUrls';

const { USERTYPE } = PERSON.FIELDS;

export default shape({
  id: number,
  alias: string,
  email: string,
  personType: oneOf([
    USERTYPE.GUEST,
    USERTYPE.REGISTERED,
    USERTYPE.ADMIN,
    USERTYPE.SUPER_ADMIN,
  ]),
  avatarURLs: ImageUrls,
});
