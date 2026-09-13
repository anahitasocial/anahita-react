import PERSON from '../constants/person';
import imageUrlsDefault from './ImageUrlsDefault';

const { USERTYPE } = PERSON.FIELDS;

export default {
  id: null,
  type: 'node.actor.person-service.person.v1',
  name: '',
  alias: '',
  personType: USERTYPE.GUEST,
  personPronouns: '',
  body: '',
  gadgets: [],
  composers: [],
  avatarURLs: imageUrlsDefault,
  coverURLs: imageUrlsDefault,
  followerCount: 0,
  leaderCount: 0,
  mutualCount: 0,
  subscriberCount: 0,
  creationTime: '0000-00-00 00:00:00',
  updateTime: '0000-00-00 00:00:00',
  websiteUrl: '',
};
