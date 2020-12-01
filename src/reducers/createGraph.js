import utils from '../utils';

const {
  editItem,
  deleteItem,
} = utils.reducer;

export default (namespace, defaultNode) => {
  const DEFAULT_STATE = {
    [namespace]: {},
    isFetching: {},
    error: {},
  };

  return (state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case `${namespace.toUpperCase()}_GRAPH_BROWSE_RESET`:
        return {
          ...state,
          ...DEFAULT_STATE,
        };
      case `${namespace.toUpperCase()}_GRAPH_BROWSE_REQUEST`:
      case `${namespace.toUpperCase()}_GRAPH_ADD_REQUEST`:
      case `${namespace.toUpperCase()}_GRAPH_DELETE_REQUEST`:
        return {
          ...state,
          isFetching: {
            ...state.isFetching,
            [action.parent.id]: true,
          },
          success: {
            ...state.success,
            [action.parent.id]: false,
          },
          error: {
            ...state.error,
            [action.parent.id]: '',
          },
        };
      case `${namespace.toUpperCase()}_GRAPH_BROWSE_SUCCESS`:
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            [action.parent.id]: {
              byId: action[namespace] || {},
              allIds: action.ids || [],
              current: { ...defaultNode },
            },
          },
          isFetching: {
            ...state.isFetching,
            [action.parent.id]: false,
          },
          error: {
            ...state.error,
            [action.parent.id]: '',
          },
        };
      case `${namespace.toUpperCase()}_GRAPH_ADD_SUCCESS`:
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            [action.parent.id]: editItem(
              state[namespace][action.parent.id],
              action.node,
              defaultNode,
            ),
          },
          isFetching: {
            ...state.isFetching,
            [action.parent.id]: false,
          },
          success: {
            ...state.success,
            [action.parent.id]: true,
          },
          error: {
            ...state.error,
            [action.parent.id]: '',
          },
        };
      case `${namespace.toUpperCase()}_GRAPH_DELETE_SUCCESS`:
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            [action.parent.id]: deleteItem(
              state[namespace][action.parent.id],
              action.node,
              defaultNode,
            ),
          },
          isFetching: {
            ...state.isFetching,
            [action.parent.id]: false,
          },
          success: {
            ...state.success,
            [action.parent.id]: true,
          },
          error: {
            ...state.error,
            [action.parent.id]: '',
          },
        };
      case `${namespace.toUpperCase()}_GRAPH_BROWSE_FAILURE`:
      case `${namespace.toUpperCase()}_GRAPH_ADD_FAILURE`:
      case `${namespace.toUpperCase()}_GRAPH_DELETE_FAILURE`:
        return {
          ...state,
          isFetching: {
            ...state.isFetching,
            [action.parent.id]: false,
          },
          error: {
            ...state.error,
            [action.parent.id]: action.error,
          },
        };
      default:
        return state;
    }
  };
};
