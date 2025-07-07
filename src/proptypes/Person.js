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

const { USERTYPE, GENDER } = PERSON.FIELDS;

export default shape({
  id: number,
  type: oneOf(['node.actor.person-service.person.v1']),
  name: string,
  alias: string,
  username: string,
  email: string,
  password: string,
  usertype: oneOf([
    USERTYPE.GUEST,
    USERTYPE.REGISTERED,
    USERTYPE.ADMIN,
    USERTYPE.SUPER_ADMIN,
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
  avatarURL: imageURL,
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
