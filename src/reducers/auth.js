//import _ from 'lodash';
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS
} from '../constants/actions';

export default function(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('viewer') ? true : false,
    viewer: localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {},
    errorMessage: ''
}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                viewer: {}
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                viewer: localStorage.getItem('viewer') ? JSON.parse(localStorage.getItem('viewer')) : {},
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                error: action.error
            });
        case LOGOUT_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: true
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                error: ''
            });
        default:
            return state;
    }
};
