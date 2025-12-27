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
  username: string,
  email: string,
  userType: oneOf([
    USERTYPE.GUEST,
    USERTYPE.REGISTERED,
    USERTYPE.ADMIN,
    USERTYPE.SUPER_ADMIN,
  ]),
  givenName: string,
  familyName: string,
  avatarURLs: ImageUrls,
});
