import ActorDefault from './ActorDefault';
import PersonDefault from './PersonDefault';
import NodeDefault from './NodeDefault';

export default {
  id: null,
  name: '',
  objectType: 'com.stories.story',
  component: '',
  creationTime: '0000-00-00 00:00:00',
  commands: [],
  owner: ActorDefault,
  subject: PersonDefault,
  object: NodeDefault,
  target: ActorDefault,
};
