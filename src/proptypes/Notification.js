import {
  shape,
  number,
  string,
  oneOfType,
  bool,
} from 'prop-types';

import ActorType from './Actor';
import MediumType from './Medium';
import PersonType from './Person';

export default shape({
  id: number,
  type: string,
  service: string,
  creationTime: string,
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
  isRead: bool,
});
