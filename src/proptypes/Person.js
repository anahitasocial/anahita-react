import {
  shape,
  number,
  string,
  oneOf,
  arrayOf,
  objectOf,
  oneOfType,
  any,
} from 'prop-types';

import PERSON from '../constants/person';
import imageURL from './ImageURL';

const { TYPE, GENDER } = PERSON.FIELDS;

export default shape({
  id: number,
  objectType: oneOf(['com.people.person']),
  name: string,
  alias: string,
  username: string,
  email: string,
  password: string,
  type: oneOf([
    TYPE.GUEST,
    TYPE.REGISTERED,
    TYPE.ADMIN,
    TYPE.SUPER_ADMIN,
  ]),
  givenName: string,
  familyName: string,
  gender: oneOf([
    GENDER.NEUTRAL,
    GENDER.FEMALE,
    GENDER.MALE,
    GENDER.OTHER,
    '',
  ]),
  body: string,
  gadgets: arrayOf(string),
  composers: arrayOf(string),
  imageURL,
  coverURL: imageURL,
  followerCount: number,
  leaderCount: number,
  mutualCount: number,
  subscriberCount: number,
  creationTime: string,
  updateTime: string,
  information: oneOfType([
    objectOf(any),
    arrayOf(any),
  ]),
});
