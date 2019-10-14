import { Node as NODE } from '../constants';
import NODE_DEFAULT from '../proptypes/NodeDefault';
import utils from './utils';

const DEFAULT_STATE = {
  isFetching: false,
  nodes: {
    byId: {},
    allIds: [],
    current: { ...NODE_DEFAULT },
  },
  error: '',
  success: false,
};

export default function (state = {
  ...DEFAULT_STATE,
}, action) {
  switch (action.type) {
    case NODE.READ.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case NODE.DELETE.REQUEST:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          current: action.node,
        },
        isFetching: true,
        success: false,
        error: '',
      };
    case NODE.READ.SUCCESS:
      return {
        ...state,
        isFetching: false,
        nodes: utils.editItem(state.nodes, action.node),
        success: true,
      };
    case NODE.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        nodes: utils.deleteItem(state.nodes, state.nodes.current, NODE_DEFAULT),
        success: true,
      };
    case NODE.READ.FAILURE:
    case NODE.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        success: false,
      };
    default:
      return state;
  }
}
