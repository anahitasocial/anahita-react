import {
  shape,
  number,
  string,
  oneOfType,
} from 'prop-types';

import ActorType from './Actor';
import MediumType from './Medium';
import PersonType from './Person';

export default shape({
  id: number,
  name: string,
  type: string,
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
