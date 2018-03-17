import { Auth as AUTH } from '../constants';

export default function(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('viewer') ? true : false,
  viewer: localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {},
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
