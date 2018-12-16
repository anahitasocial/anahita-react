import {
  shape,
  number,
  string,
  oneOf,
} from 'prop-types';

import PERSON from '../constants/person';

const { TYPE, GENDER } = PERSON;

export default shape({
  id: number,
  objectType: oneOf(['com.people.person']),
  name: string,
  alias: string,
  username: string,
  password: string,
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
  ]),
  imageURL: {
    large: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
    medium: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
    original: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
  },
  coverURL: {
    large: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
    medium: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
    original: {
      size: {
        width: number,
        height: number,
      },
      url: string,
    },
  },
  followerCount: number,
  leaderCount: number,
  mutualCount: number,
  subscriberCount: number,
  creationTime: string,
  updateTime: string,
});
