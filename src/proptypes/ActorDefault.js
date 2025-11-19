import personDefault from './PersonDefault';
import imageUrlsDefault from './ImageUrlsDefault';

export default {
  id: null,
  type: '',
  name: '',
  alias: '',
  body: '',
  features: [],
  commands: [],
  avatarUrls: imageUrlsDefault,
  coverUrls: imageUrlsDefault,
  administrators: [],
  followerCount: 0,
  subscriberCount: 0,
  isSubscribedByViewer: false,
  author: personDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: personDefault,
  updateTime: '0000-00-00 00:00:00',
  isAdministrated: false,
  isLeader: false,
  information: null,
};
