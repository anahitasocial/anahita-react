import createReducer from './create';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';

export default (state, action) => {
  return createReducer('groups', ACTOR_DEFAULT)(state, action);
};
