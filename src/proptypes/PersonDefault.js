import PERSON from '../constants/person';
import ImageURLDefault from './ImageURLDefault';

const { TYPE, GENDER } = PERSON;

export default {
  id: null,
  objectType: 'com.people.person',
  name: '',
  alias: '',
  username: '',
  usertype: TYPE.GUEST,
  givenName: '',
  familyName: '',
  body: '',
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
