import PERSON from '../constants/person';

const { TYPE, GENDER } = PERSON;

export default {
  id: null,
  objectType: 'com.people.person',
  name: '',
  alias: '',
  username: '',
  usertype: TYPE.REGISTERED,
  givenName: '',
  familyName: '',
  body: '',
  gender: GENDER.NEUTRAL,
  imageURL: null,
  coverURL: null,
  followerCount: 0,
  leaderCount: 0,
  mutualCount: 0,
  subscriberCount: 0,
  creationTime: '0000-00-00 00:00:00',
  updateTime: '0000-00-00 00:00:00',
};
