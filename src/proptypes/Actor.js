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
  object,
} from 'prop-types';

import personType from './Person';
import imageURL from './ImageURL';

export default shape({
  id: number,
  type: oneOf([
    'node.actor.person-service.person.v1',
    'node.actor.group-service.group.v1',
  ]),
  name: string,
  alias: string,
  body: string,
  gadgets: arrayOf(string),
  features: arrayOf(string),
  composers: arrayOf(string),
  commands: arrayOf(string),
  avatarURL: imageURL,
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
