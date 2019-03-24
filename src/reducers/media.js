import _ from 'lodash';
import { Media as MEDIA } from '../constants';
import MediumDefault from '../proptypes/MediumDefault';
import utils from './utils';

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    media: {
      byId: {},
      allIds: [],
      current: MediumDefault,
    },
    error: '',
    total: 0,
    hasMore: true,
    ...higherOrderState,
  };

  switch (action.type) {
    case MEDIA.BROWSE.RESET:
      return {
        ...state,
        media: {
          byId: {},
          allIds: [],
          current: MediumDefault,
        },
        total: 0,
        hasMore: true,
        isFetching: false,
        error: '',
      };
    case MEDIA.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case MEDIA.DELETE.REQUEST:
      return {
        ...state,
        media: {
          ...state.media,
          current: action.medium,
        },
        isFetching: true,
        success: false,
        error: '',
      };
    case MEDIA.BROWSE.SUCCESS:
      return {
        ...state,
        media: {
          byId: {
            ...state.media.byId,
            ...action.media,
          },
          allIds: _.union(state.media.allIds, action.ids),
          current: MediumDefault,
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case MEDIA.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        media: utils.deleteItem(state.media, state.media.current),
        success: true,
      };
    case MEDIA.BROWSE.FAILURE:
    case MEDIA.DELETE.FAILURE:
      return {
        ...state,
        hasMore: false,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
