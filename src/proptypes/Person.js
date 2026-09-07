import {
  shape,
  number,
  string,
  oneOf,
  arrayOf,
} from 'prop-types';

import PERSON from '../constants/person';
import ImageUrls from './ImageUrls';

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
  avatarURLs: ImageUrls,
  coverURLs: ImageUrls,
  followerCount: number,
  leaderCount: number,
  mutualCount: number,
  subscriberCount: number,
  creationTime: string,
  updateTime: string,
  websiteUrl: string,
});
