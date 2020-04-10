import PERSON from '../constants/person';
import ImageURLDefault from './ImageURLDefault';

const { TYPE, GENDER } = PERSON.FIELDS;

export default {
  id: null,
  objectType: 'com.people.person',
  name: '',
  alias: '',
  username: '',
  email: '',
  password: '',
  usertype: TYPE.REGISTERED,
  givenName: '',
  familyName: '',
  body: '',
  gadgets: {},
  gender: GENDER.NEUTRAL,
  imageURL: ImageURLDefault,
  coverURL: ImageURLDefault,
  followerCount: 0,
  leaderCount: 0,
  mutualCount: 0,
  subscriberCount: 0,
  creationTime: '0000-00-00 00:00:00',
  updateTime: '0000-00-00 00:00:00',
};
