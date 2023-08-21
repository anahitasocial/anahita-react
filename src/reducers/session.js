/* eslint-disable no-undef */
import {
  Auth as AUTH,
  Person as PERSON,
  Session as SESSION,
} from '../constants';
import PersonDefault from '../proptypes/PersonDefault';

const {
  GUEST,
  REGISTERED,
  ADMIN,
  SUPER_ADMIN,
} = PERSON.FIELDS.TYPE;

const { VIEWER_STORAGE_KEY } = AUTH;

const viewer = localStorage.getItem(VIEWER_STORAGE_KEY) ?
  JSON.parse(localStorage.getItem(VIEWER_STORAGE_KEY)) :
  { ...PersonDefault, usertype: GUEST };

const initState = {
  viewer,
  isAuthenticated: (
    viewer.usertype === REGISTERED
    || viewer.usertype === ADMIN
    || viewer.usertype === SUPER_ADMIN
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
    case SESSION.DELETE.REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        success: false,
        error: '',
      };
    case SESSION.DELETE.SUCCESS:
      return {
        ...state,
        viewer: { ...PersonDefault },
        isAuthenticated: false,
        isFetching: false,
        error: '',
      };
    case SESSION.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
};
