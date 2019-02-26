import {
  shape,
  number,
  string,
  object,
  oneOf,
  arrayOf,
} from 'prop-types';

import ActorType from './Actor';
import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  objectType: oneOf([
    'com.media.medium',
    'com.photos.photo',
    'com.photos.set',
    'com.topics.topic',
    'com.todos.todo',
    'com.notes.note',
    'com.articles.article',
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
  lastComment: object,
  lastCommenter: PersonType,
  lastCommentTime: string,
  voteUpCount: number,
});
