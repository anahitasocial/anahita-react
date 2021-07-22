import _ from 'lodash';
import utils from '../utils';

const {
  editItem,
  deleteItem,
} = utils.reducer;

export default (namespace, defaultNode) => {
  const DEFAULT_STATE = {
    isFetching: false,
    [namespace]: {
      byId: {},
      allIds: [],
      current: { ...defaultNode },
    },
    total: 0,
    hasMore: true,
    error: '',
    success: false,
  };

  return (state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case `${namespace.toUpperCase()}_BROWSE_RESET`:
        return {
          ...state,
          ...DEFAULT_STATE,
        };
      case `${namespace.toUpperCase()}_BROWSE_REQUEST`:
      case `${namespace.toUpperCase()}_READ_REQUEST`:
      case `${namespace.toUpperCase()}_EDIT_REQUEST`:
      case `${namespace.toUpperCase()}_ADD_REQUEST`:
        return {
          ...state,
          isFetching: true,
          success: false,
          error: '',
        };
      case `${namespace.toUpperCase()}_DELETE_REQUEST`:
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
      case `${namespace.toUpperCase()}_BROWSE_SUCCESS`:
        return {
          ...state,
          [namespace]: {
            byId: {
              ...state[namespace].byId,
              ...action[namespace],
            },
            allIds: _.uniq([...state[namespace].allIds, ...action.ids]),
            current: { ...defaultNode },
          },
          total: action.total,
          hasMore: action.hasMore,
          isFetching: false,
        };
      case `${namespace.toUpperCase()}_READ_SUCCESS`:
        return {
          ...state,
          isFetching: false,
          [namespace]: editItem(
            state[namespace],
            action.node,
            defaultNode,
          ),
          success: false,
        };
      case `${namespace.toUpperCase()}_EDIT_SUCCESS`:
      case `${namespace.toUpperCase()}_ADD_SUCCESS`:
        return {
          ...state,
          isFetching: false,
          [namespace]: editItem(
            state[namespace],
            action.node,
            defaultNode,
          ),
          success: true,
        };
      case `${namespace.toUpperCase()}_DELETE_SUCCESS`:
        return {
          ...state,
          isFetching: false,
          success: false,
          [namespace]: deleteItem(
            state[namespace],
            state[namespace].current,
            defaultNode,
          ),
        };
      case `${namespace.toUpperCase()}_BROWSE_FAILURE`:
      case `${namespace.toUpperCase()}_READ_FAILURE`:
      case `${namespace.toUpperCase()}_EDIT_FAILURE`:
      case `${namespace.toUpperCase()}_ADD_FAILURE`:
      case `${namespace.toUpperCase()}_DELETE_FAILURE`:
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
