import { Avatar as AVATAR } from '../constants';
import NODE_DEFAULT from '../proptypes/NodeDefault';
import utils from './utils';

const DEFAULT_STATE = {
  isFetching: false,
  nodes: {
    byId: {},
    allIds: [],
    current: NODE_DEFAULT,
  },
  error: '',
  success: false,
};

export default function (state = {
  ...DEFAULT_STATE,
}, action) {
  switch (action.type) {
    case AVATAR.ADD.REQUEST:
    case AVATAR.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case AVATAR.ADD.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        nodes: utils.editItem(state.nodes, action.node),
      };
    case AVATAR.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        nodes: utils.deleteItem(state.nodes, action.node),
      };
    case AVATAR.ADD.FAILURE:
    case AVATAR.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
