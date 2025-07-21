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
  type: oneOf([
    'node.actor.person-service.person.v1',
    'node.actor.group-service.group.v1',
  ]),
  name: string,
  alias: string,
  body: string,
  features: arrayOf(shape({
    service: string,
    composers: arrayOf(string),
    optional: bool,
    enabled: bool,
    addPermissions: arrayOf(shape({
      entity: string, // The type of entity that can be added (e.g., 'person', 'group')
      access: string, // The access level for the entity (e.g., 'admins', 'followers')
    })),
    ordering: number, // The order in which the feature should be processed
  })),
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
