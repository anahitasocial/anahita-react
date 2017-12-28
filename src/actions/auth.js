import { routeActions } from 'redux-simple-router';
import { auth } from '../api';
//import * as alerts from './alerts';

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS,
} from '../constants/actions';

// - Login Action -

function requestLogin(credentials) {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        credentials: credentials
    };
}

function receiveLogin(result) {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        result: result
    };
}

function loginError(error) {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        error: error
    };
}

export function login(credentials) {
    return dispatch => {
        dispatch(requestLogin(credentials));
        return new Promise((resolve, reject) => {
            return auth.addSession(credentials)
            .then(result => {
                localStorage.setItem('viewer', JSON.stringify(result.data));
                dispatch(receiveLogin(result));
                dispatch(routeActions.replace('/dashboard/'));
                resolve();
            }, (response) => {
                dispatch(loginError("Sorry, unable to log  you in!"));
                reject(response);
            });
        }).catch(error => console.log(error));
    };
}

// - Logout Action

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true
    }
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false
    }
}

export function logout() {
    return dispatch => {
        dispatch(requestLogout());
        return new Promise((resolve, reject) => {
            return auth.deleteSession()
            .then(result => {
                dispatch(receiveLogout());
                localStorage.removeItem('viewer');
                dispatch(routeActions.push('/people/login/'));
                resolve();
            }, (response) => {
                reject(response);
            }).catch(error => console.log(error));
        });
    };
}

export function unauthorized() {
  return dispatch => {
    dispatch(logout());
    dispatch(routeActions.push('/people/login/'));
  };
}
