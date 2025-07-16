import personDefault from './PersonDefault';
import imageURLDefault from './ImageURLDefault';

export default {
  id: null,
  type: '',
  name: '',
  alias: '',
  body: '',
  features: [],
  commands: [],
  avatarURL: imageURLDefault,
  coverURL: imageURLDefault,
  administrators: [],
  followerCount: 0,
  subscriberCount: 0,
  author: personDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: personDefault,
  updateTime: '0000-00-00 00:00:00',
  isAdministrated: false,
  isLeader: false,
  information: null,
};
