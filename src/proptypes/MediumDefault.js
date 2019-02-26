import ActorDefault from './ActorDefault';
import PersonType from './Person';
import PersonDefault from './PersonDefault';
import ImageURL from './ImageURL';

export default {
  id: null,
  objectType: 'com.media.medium',
  name: '',
  alias: '',
  body: '',
  imageURL: ImageURL,
  coverURL: ImageURL,
  commands: [],
  subscriberCount: 0,
  owner: ActorDefault,
  author: PersonDefault,
  creationTime: '0000-00-00 00:00:00',
  editor: PersonDefault,
  updateTime: '0000-00-00 00:00:00',
  lastComment: {},
  lastCommenter: PersonType,
  lastCommentTime: '0000-00-00 00:00:00',
  voteUpCount: 0,
};
