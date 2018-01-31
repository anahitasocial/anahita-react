import { auth } from '../api';

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS,
} from '../constants/auth';

// - Login Action -

function requestLogin(credentials) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    credentials,
  };
}

function receiveLogin(result) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    result,
  };
}

function loginError(error) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    error,
  };
}

export function login(credentials) {
  return (dispatch) => {
    dispatch(requestLogin(credentials));
    return new Promise((resolve, reject) => {
      return auth.addSession(credentials)
        .then((result) => {
          localStorage.setItem('viewer', JSON.stringify(result.data));
          dispatch(receiveLogin(result));
          resolve();
          return result;
        }, (response) => {
          dispatch(loginError('Sorry, unable to log  you in!'));
          return reject(response);
        });
    }).catch((error) => {
      console.log(error);
    });
  };
}

// - Logout Action

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true,
  };
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(requestLogout());
    return new Promise((resolve, reject) => {
      auth.deleteSession()
        .then((result) => {
          dispatch(receiveLogout());
          localStorage.removeItem('viewer');
          resolve();
          return result;
        }, (response) => {
          reject(response);
          return response;
        }).catch((error) => {
          console.log(error)
        });
    });
  };
}

export function unauthorized() {
  return (dispatch) => {
    dispatch(logout());
  };
}
