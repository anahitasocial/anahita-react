import {
  shape,
  number,
  string,
  oneOf,
  oneOfType,
  arrayOf,
} from 'prop-types';

import ActorType from './Actor';
import MediumType from './Medium';
import PersonType from './Person';

export default shape({
  id: number,
  name: string,
  type: oneOf([
    'node.story.story-service.story.v1',
  ]),
  component: string,
  creationTime: string,
  commands: arrayOf(string),
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
