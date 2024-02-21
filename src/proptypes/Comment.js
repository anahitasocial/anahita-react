import {
  shape,
  number,
  string,
  oneOf,
  bool,
} from 'prop-types';

import PersonType from './Person';

export default shape({
  id: number,
  objectType: oneOf([
    'com.media.medium',
    'com.articles.comment',
    'com.media.comment',
    'com.notes.comment',
    'com.photos.comment',
    'com.todos.comment',
    'com.topics.comment',
  ]),
  body: string,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  likesCount: number,
  dislikesCount: number,
  isLiked: bool,
});
