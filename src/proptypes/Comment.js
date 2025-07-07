import {
  shape,
  number,
  string,
  bool,
} from 'prop-types';

import PersonType from './Person';

export default shape({
  id: number,
  type: string,
  body: string,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  likesCount: number,
  dislikesCount: number,
  isLiked: bool,
});
