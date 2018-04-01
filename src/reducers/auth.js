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
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        viewer: {},
      });
    case AUTH.LOGIN.SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        error: '',
        viewer: localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {},
      });
    case AUTH.LOGIN.FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.error,
      });
    case AUTH.LOGOUT.REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: true,
      });
    case AUTH.LOGOUT.SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: '',
      });
    default:
      return state;
  }
}
