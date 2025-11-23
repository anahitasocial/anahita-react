import PersonDefault from './PersonDefault';
import ImageUrlsDefault from './ImageUrlsDefault';

export default {
  id: 0,
  type: '',
  name: '',
  alias: '',
  body: '',
  imageURLs: ImageUrlsDefault,
  coverURLs: ImageUrlsDefault,
  administrators: [],
  followerCount: 0,
  subscriberCount: 0,
  author: PersonDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: PersonDefault,
  updateTime: '0000-00-00 00:00:00',
  isAdministrated: false,
  isLeader: false,
  isSubscribedByViewer: false,
  repostCount: 0,
  isRepostedByViewer: false,
  quoteCount: 0,
  isQuotedByViewer: false,
  commentCount: 0,
};
