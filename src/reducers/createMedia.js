import createReducer from './create';
import MEDIUM_DEFAULT from '../proptypes/MediumDefault';
import utils from '../utils';

const {
  editItem,
} = utils.reducer;

export default (namespace) => {
  return (iniState, action) => {
    const state = createReducer(namespace, MEDIUM_DEFAULT)(iniState, action);
    const { type } = action;
    switch (type) {
      case `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`:
      case `${namespace.toUpperCase()}_LIKES_DELETE_REQUEST`:
      case `${namespace.toUpperCase()}_PRIVACY_EDIT_REQUEST`:
        return {
          ...state,
          isFetching: true,
          success: false,
          error: '',
        };
      case `${namespace.toUpperCase()}_LIKES_ADD_SUCCESS`:
      case `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`:
      case `${namespace.toUpperCase()}_PRIVACY_EDIT_SUCCESS`:
        return {
          ...state,
          [namespace]: editItem(
            state[namespace],
            action.node,
            MEDIUM_DEFAULT,
          ),
          isFetching: false,
          success: false,
          error: '',
        };
      case `${namespace.toUpperCase()}_LIKES_ADD_FAILURE`:
      case `${namespace.toUpperCase()}_LIKES_DELETE_FAILURE`:
      case `${namespace.toUpperCase()}_PRIVACY_EDIT_FAILURE`:
        return {
          ...state,
          isFetching: false,
          success: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
};
