import {
  Auth as AUTH,
  Person as PERSON,
} from '../constants';

const viewer = localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {};

export default function (state = {
  isFetching: false,
  isAuthenticated: viewer.id && (
    viewer.usertype === PERSON.TYPE.REGISTERED ||
    viewer.usertype === PERSON.TYPE.ADMIN ||
    viewer.usertype === PERSON.TYPE.SUPER_ADMIN
  ),
  viewer,
  error: '',
}, action) {
  switch (action.type) {
    case AUTH.LOGIN.REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        viewer: {},
      };
    case AUTH.LOGIN.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        error: '',
        viewer: localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {},
      };
    case AUTH.LOGIN.FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        error: action.error,
      };
    case AUTH.LOGOUT.REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: true,
      };
    case AUTH.LOGOUT.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        error: '',
      };
    case AUTH.SIGNUP.REQUEST:
    case AUTH.PASSWORD_RESET.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case AUTH.SIGNUP.SUCCESS:
    case AUTH.PASSWORD_RESET.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
      };
    case AUTH.SIGNUP.FAILURE:
    case AUTH.PASSWORD_RESET.FAILURE:
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
