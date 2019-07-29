import createReducer from './create';
import MEDIUM_DEFAULT from '../proptypes/MediumDefault';

export default (namespace) => {
  return (state, action) => {
    return createReducer(namespace, MEDIUM_DEFAULT)(state, action);
  };
};
