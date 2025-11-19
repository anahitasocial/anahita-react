import PERSON from '../constants/person';
import imageUrlsDefault from './ImageUrlsDefault';

const { USERTYPE, GENDER } = PERSON.FIELDS;

export default {
  id: null,
  type: 'node.actor.person-service.person.v1',
  name: '',
  alias: '',
  username: '',
  email: '',
  password: '',
  usertype: USERTYPE.PUBLIC,
  givenName: '',
  familyName: '',
  body: '',
  gadgets: [],
  composers: [],
  gender: GENDER.NEUTRAL,
  avatarURLs: imageUrlsDefault,
  coverURLs: imageUrlsDefault,
  followerCount: 0,
  leaderCount: 0,
  mutualCount: 0,
  subscriberCount: 0,
  creationTime: '0000-00-00 00:00:00',
  updateTime: '0000-00-00 00:00:00',
  information: null,
};
