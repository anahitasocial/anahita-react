import { Cover as COVER } from '../constants';
import NODE_DEFAULT from '../proptypes/NodeDefault';
import utils from '../utils';

const {
  editItem,
  deleteItem,
} = utils.reducer;

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

export default (state = {
  ...DEFAULT_STATE,
}, action) => {
  switch (action.type) {
    case COVER.ADD.REQUEST:
    case COVER.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case COVER.ADD.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        nodes: editItem(state.nodes, action.node),
      };
    case COVER.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        nodes: deleteItem(state.nodes, action.node, NODE_DEFAULT),
      };
    case COVER.ADD.FAILURE:
    case COVER.DELETE.FAILURE:
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
