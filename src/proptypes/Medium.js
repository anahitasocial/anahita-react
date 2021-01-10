import {
  shape,
  number,
  string,
  oneOf,
  arrayOf,
} from 'prop-types';

import ActorType from './Actor';
import CommentType from './Comment';
import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  objectType: oneOf([
    'com.articles.article',
    'com.documents.document',
    'com.media.medium',
    'com.notes.note',
    'com.photos.photo',
    'com.photos.set',
    'com.topics.topic',
    'com.todos.todo',
  ]),
  name: string,
  alias: string,
  body: string,
  imageURL: ImageURL,
  coverURL: ImageURL,
  commands: arrayOf(string),
  subscriberCount: number,
  owner: ActorType,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  lastComment: CommentType,
  lastCommenter: PersonType,
  lastCommentTime: string,
  voteUpCount: number,
});
