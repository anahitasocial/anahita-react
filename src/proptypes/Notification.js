import {
  shape,
  number,
  string,
  oneOf,
  oneOfType,
} from 'prop-types';

import ActorType from './Actor';
import MediumType from './Medium';
import PersonType from './Person';

export default shape({
  id: number,
  name: string,
  objectType: oneOf([
    'com.notifications.notification',
  ]),
  component: string,
  creationTime: string,
  owner: ActorType,
  subject: PersonType,
  object: oneOfType([
    MediumType,
    PersonType,
    ActorType,
  ]),
  target: oneOfType([
    PersonType,
    ActorType,
  ]),
});
