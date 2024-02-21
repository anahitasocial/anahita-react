import ActorDefault from './ActorDefault';
import PersonDefault from './PersonDefault';
import ImageURLDefault from './ImageURLDefault';

export default {
  id: null,
  objectType: 'com.media.medium',
  name: '',
  alias: '',
  body: '',
  portraitURL: ImageURLDefault,
  coverURL: ImageURLDefault,
  commands: [],
  subscriberCount: 0,
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
  isLiked: false,
};
