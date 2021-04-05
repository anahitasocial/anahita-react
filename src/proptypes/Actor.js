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

import personType from './Person';
import imageURL from './ImageURL';

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
  imageURL,
  coverURL: imageURL,
  administrators: arrayOf(personType),
  followerCount: number,
  subscriberCount: number,
  author: personType,
  creationTime: string,
  editor: personType,
  updateTime: string,
  isAdministrated: bool,
  isLeader: bool,
  information: oneOfType([
    objectOf(any),
    arrayOf(any),
  ]),
});
