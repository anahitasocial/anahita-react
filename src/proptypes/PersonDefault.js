import PERSON from '../constants/person';
import imageURLDefault from './ImageURLDefault';

const { TYPE, GENDER } = PERSON.FIELDS;

export default {
  id: null,
  objectType: 'com.people.person',
  name: '',
  alias: '',
  username: '',
  email: '',
  password: '',
  usertype: TYPE.PUBLIC,
  givenName: '',
  familyName: '',
  body: '',
  gadgets: [],
  composers: [],
  gender: GENDER.NEUTRAL,
  imageURL: imageURLDefault,
  coverURL: imageURLDefault,
  followerCount: 0,
  leaderCount: 0,
  mutualCount: 0,
  subscriberCount: 0,
  creationTime: '0000-00-00 00:00:00',
  updateTime: '0000-00-00 00:00:00',
  information: null,
};
