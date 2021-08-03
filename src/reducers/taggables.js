import createReducer from './create';
import DEFAULT_NODE from '../proptypes/NodeDefault';
// import MEDIUM_DEFAULT from '../proptypes/MediumDefault';
// import utils from '../utils';

export default (state, action) => {
  return createReducer('taggables', DEFAULT_NODE)(state, action);
};

/*

const {
  editItem,
} = utils.reducer;

export default (namespace) => {
  return (iniState, action) => {
    const state = createReducer(namespace, DEFAULT_NODE)(iniState, action);
    const { type } = action;
    switch (type) {
      case `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`:
      case `${namespace.toUpperCase()}_LIKES_DELETE_REQUEST`:
        return {
          ...state,
          isFetching: true,
          success: false,
          error: '',
        };
      case `${namespace.toUpperCase()}_LIKES_ADD_SUCCESS`:
      case `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`:
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
*/
