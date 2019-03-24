import { Notifications as NOTIFICATIONS } from '../constants';

export default (state = {
  error: '',
  isFetching: false,
}, action) => {
  switch (action.type) {
    case NOTIFICATIONS.ADD.REQUEST:
    case NOTIFICATIONS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case NOTIFICATIONS.ADD.SUCCESS:
    case NOTIFICATIONS.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: '',
      };
    case NOTIFICATIONS.ADD.FAILURE:
    case NOTIFICATIONS.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
