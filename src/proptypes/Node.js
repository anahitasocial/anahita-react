import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

import ActorType from './Actor';
import PersonType from './Person';
import ImageURL from './ImageURL';
import CommentsType from './Comments';

export default shape({
  id: number,
  owner: ActorType,
  objectType: string,
  name: string,
  alias: string,
  body: string,
  imageURL: ImageURL,
  coverURL: ImageURL,
  administrators: arrayOf(PersonType),
  followerCount: number,
  subscriberCount: number,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  isAdministrated: bool,
  isLeader: bool,
  comments: CommentsType,
});
