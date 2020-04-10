import {
  shape,
  number,
  string,
  oneOf,
  objectOf,
  any,
} from 'prop-types';

import PERSON from '../constants/person';
import ImageURL from './ImageURL';

const { TYPE, GENDER } = PERSON.FIELDS;

export default shape({
  id: number,
  objectType: oneOf(['com.people.person']),
  name: string,
  alias: string,
  username: string,
  usertype: oneOf([
    TYPE.GUEST,
    TYPE.REGISTERED,
    TYPE.ADMIN,
    TYPE.SUPER_ADMIN,
  ]),
  givenName: string,
  familyName: string,
  body: string,
  gender: oneOf([
    GENDER.NEUTRAL,
    GENDER.FEMALE,
    GENDER.MALE,
    GENDER.OTHER,
    '',
  ]),
  gadgets: objectOf(any),
  imageURL: ImageURL,
  coverURL: ImageURL,
  followerCount: number,
  leaderCount: number,
  mutualCount: number,
  subscriberCount: number,
  creationTime: string,
  updateTime: string,
});
