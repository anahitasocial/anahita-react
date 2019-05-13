import _ from 'lodash';

export default (namespace, defaultNode) => {
  const DEFAULT_STATE = {
    isFetching: false,
    [namespace]: {
      byId: {},
      allIds: [],
      current: { ...defaultNode },
    },
    error: '',
    total: 0,
    hasMore: true,
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
        return {
          ...state,
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
              ...action.nodes,
            },
            allIds: _.union(state[namespace].allIds, action.ids),
            current: null,
          },
          total: action.total,
          hasMore: action.hasMore,
          isFetching: false,
        };
      case `${namespace.toUpperCase()}_BROWSE_FAILURE`:
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
