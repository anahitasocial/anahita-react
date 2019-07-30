import createReducer from './create';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';
import PERSON_DEFAULT from '../proptypes/PersonDefault';

export default (namespace) => {
  const DEFAULT_NODE = namespace === 'people' ? PERSON_DEFAULT : ACTOR_DEFAULT;
  return (state, action) => {
    return createReducer(namespace, DEFAULT_NODE)(state, action);
  };
};
