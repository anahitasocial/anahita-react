import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  objectType: string,
  name: string,
  alias: string,
  body: string,
  imageURL: ImageURL,
  coverURL: ImageURL,
  administratorIds: arrayOf(number),
  followerCount: number,
  subscriberCount: number,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  isAdministrated: bool,
  isLeader: bool,
});
