import createReducer from './create';
import PERSON_DEFAULT from '../proptypes/PersonDefault';

export default (state, action) => {
  return createReducer('people', PERSON_DEFAULT)(state, action);
};
