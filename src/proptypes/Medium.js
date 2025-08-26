import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

import ActorType from './Actor';
import CommentType from './Comment';
import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  type: string,
  name: string,
  alias: string,
  body: string,
  portraitURL: ImageURL,
  coverURL: ImageURL,
  commands: arrayOf(string),
  subscriberCount: number,
  isSubscribedByViewer: bool,
  owner: ActorType,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  lastComment: CommentType,
  lastCommenter: PersonType,
  lastCommentTime: string,
  likesCount: number,
  dislikesCount: number,
  isLikedByViewer: bool,
});
