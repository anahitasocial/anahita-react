import {
  Person as PERSON,
  Sessions as SESSIONS,
} from '../constants';
import PersonDefault from '../proptypes/PersonDefault';

/* global localStorage */
const viewer = localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : { ...PersonDefault };

const INIT_STATE = {
  viewer,
  isAuthenticated: (
    viewer.usertype === PERSON.TYPE.REGISTERED ||
    viewer.usertype === PERSON.TYPE.ADMIN ||
    viewer.usertype === PERSON.TYPE.SUPER_ADMIN
  ),
  isFetching: false,
  success: false,
  error: '',
};

export default (state = { ...INIT_STATE }, action) => {
  switch (action.type) {
    case SESSIONS.RESET:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: '',
      };
    case SESSIONS.READ.REQUEST:
    case SESSIONS.ADD.REQUEST:
    case SESSIONS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case SESSIONS.READ.SUCCESS:
    case SESSIONS.ADD.SUCCESS:
      return {
        ...state,
        viewer: action.viewer,
        isAuthenticated: true,
        isFetching: false,
        success: true,
        error: '',
      };
    case SESSIONS.DELETE.SUCCESS:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        success: true,
        error: '',
      };
    case SESSIONS.READ.FAILURE:
    case SESSIONS.ADD.FAILURE:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case SESSIONS.DELETE.FAILURE:
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
