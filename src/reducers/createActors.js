import createReducer from './create';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';
import PERSON_DEFAULT from '../proptypes/PersonDefault';
import { Person as PERSON } from '../constants';

export default (namespace) => {
  const { REGISTERED } = PERSON.FIELDS.TYPE;
  const DEFAULT_NODE = namespace === 'people' ?
    { ...PERSON_DEFAULT, usertype: REGISTERED } :
    ACTOR_DEFAULT;

  return (state, action) => {
    return createReducer(namespace, DEFAULT_NODE)(state, action);
  };
};
