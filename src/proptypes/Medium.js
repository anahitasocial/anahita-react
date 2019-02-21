import {
  shape,
  number,
  string,
  object,
  oneOf,
  arrayOf,
} from 'prop-types';

import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  objectType: oneOf([
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
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  lastComment: object,
  lastCommenter: PersonType,
  lastCommentTime: string,
  voteUpCount: number,
});
