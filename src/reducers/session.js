import {
  Person as PERSON,
  Session as SESSION,
} from '../constants';
import PersonDefault from '../proptypes/PersonDefault';

/* global localStorage */
const viewer = localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : { ...PersonDefault };

const initState = {
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

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case SESSION.RESET:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: '',
      };
    case SESSION.READ.REQUEST:
    case SESSION.ADD.REQUEST:
    case SESSION.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case SESSION.READ.SUCCESS:
    case SESSION.ADD.SUCCESS:
      return {
        ...state,
        viewer: action.viewer,
        isAuthenticated: true,
        isFetching: false,
        success: true,
        error: '',
      };
    case SESSION.DELETE.SUCCESS:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        success: true,
        error: '',
      };
    case SESSION.READ.FAILURE:
    case SESSION.ADD.FAILURE:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case SESSION.DELETE.FAILURE:
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
