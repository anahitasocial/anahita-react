import PersonDefault from './PersonDefault';
import ImageURLDefault from './ImageURLDefault';

export default {
  id: null,
  objectType: 'com.actors.actor',
  name: '',
  alias: '',
  body: '',
  gadgets: {},
  commands: [],
  imageURL: ImageURLDefault,
  coverURL: ImageURLDefault,
  administratorIds: [],
  followerCount: 0,
  subscriberCount: 0,
  author: PersonDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: PersonDefault,
  updateTime: '0000-00-00 00:00:00',
  isAdministrated: false,
  isLeader: false,
};
