import {
  shape,
  number,
  string,
  oneOf,
  arrayOf,
  objectOf,
  oneOfType,
  bool,
  any,
} from 'prop-types';

import PersonType from './Person';
import ImageURL from './ImageURL';

export default shape({
  id: number,
  objectType: oneOf([
    'com.actors.actor',
    'com.people.person',
    'com.groups.group',
  ]),
  name: string,
  alias: string,
  body: string,
  gadgets: arrayOf(string),
  composers: arrayOf(string),
  commands: arrayOf(string),
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
  information: oneOfType([
    objectOf(any),
    arrayOf(any),
  ]),
});
