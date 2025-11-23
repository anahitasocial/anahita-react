import ActorDefault from './ActorDefault';
import PersonDefault from './PersonDefault';
import ImageUrlsDefault from './ImageUrlsDefault';

export default {
  id: null,
  objectType: '',
  name: '',
  alias: '',
  body: '',
  portraitURL: ImageUrlsDefault,
  coverURL: ImageUrlsDefault,
  commands: [],
  subscriberCount: 0,
  isSubscribedByViewer: false,
  owner: ActorDefault,
  author: PersonDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: PersonDefault,
  updateTime: '0000-00-00 00:00:00',
  lastComment: {},
  lastCommenter: PersonDefault,
  lastCommentTime: '0000-00-00 00:00:00',
  likesCount: 0,
  dislikesCount: 0,
  isLikedByViewer: false,
  repostCount: 0,
  isRepostedByViewer: false,
  quoteCount: 0,
  isQuotedByViewer: false,
  commentCount: 0,
};
