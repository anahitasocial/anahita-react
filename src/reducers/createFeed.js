import createReducer from './create';
import NODE_DEFAULT from '../proptypes/NodeDefault';
import utils from '../utils';

const {
  editItem,
} = utils.reducer;

export default (namespace) => {
  return (iniState, action) => {
    const state = createReducer(namespace, NODE_DEFAULT)(iniState, action);
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
      case `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`: {
        const { node, child } = action;
        const hasChild = child && child.id;
        if (hasChild) {
          child.parent = node;
        }
        console.debug('reducers/createFeed.LIKES_SUCCESS', child, node);
        return {
          ...state,
          [namespace]: editItem(
            state[namespace],
            hasChild ? child : node,
            NODE_DEFAULT,
          ),
          isFetching: false,
          success: false,
          error: '',
        };
      }
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
