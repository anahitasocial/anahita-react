import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/PersonDefault';
import utils from '../../utils';

const {
  deleteItem,
} = utils.reducer;

export default (namespace) => {
  return (iniState, action) => {
    const state = createReducer(namespace, DEFAULT_ENTITY)(iniState, action);
    const { type } = action;
    switch (type) {
      case `${namespace.toUpperCase()}_CONFIRM_REQUEST`:
      case `${namespace.toUpperCase()}_IGNORE_REQUEST`:
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            current: action.node,
          },
          isFetching: true,
          success: false,
          error: '',
        };
      case `${namespace.toUpperCase()}_CONFIRM_SUCCESS`:
      case `${namespace.toUpperCase()}_IGNORE_SUCCESS`:
        return {
          ...state,
          isFetching: false,
          [namespace]: deleteItem(
            state[namespace],
            state[namespace].current,
            DEFAULT_ENTITY,
          ),
          success: true,
        };
      case `${namespace.toUpperCase()}_CONFIRM_FAILURE`:
      case `${namespace.toUpperCase()}_IGNORE_FAILURE`:
        return {
          ...state,
          hasMore: false,
          isFetching: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
};
