import { auth } from '../api';
import { Auth as AUTH } from '../constants';

// - Login Action -

function requestLogin() {
  return {
    type: AUTH.LOGIN.REQUEST,
  };
}

function receiveLogin(result) {
  return {
    type: AUTH.LOGIN.SUCCESS,
    result,
  };
}

function loginError(error) {
  return {
    type: AUTH.LOGIN.FAILURE,
    error: error.message,
  };
}

export function login(credentials) {
  return (dispatch) => {
    dispatch(requestLogin());
    return new Promise((resolve, reject) => {
      auth.addSession(credentials)
        .then((response) => {
          localStorage.setItem('viewer', JSON.stringify(response.data));
          dispatch(receiveLogin(response));
          return resolve();
        }, (response) => {
          dispatch(loginError(response));
          return reject(response);
        });
    }).catch((error) => {
      console.log(error);
      // throw new Error(error);
    });
  };
}

// - Logout Action

function requestLogout() {
  return {
    type: AUTH.LOGOUT.REQUEST,
  };
}

function receiveLogout() {
  return {
    type: AUTH.LOGOUT.SUCCESS,
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(requestLogout());
    return new Promise((resolve, reject) => {
      auth.deleteSession()
        .then(() => {
          dispatch(receiveLogout());
          localStorage.removeItem('viewer');
          return resolve();
        }, (response) => {
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

export function unauthorized() {
  return (dispatch) => {
    dispatch(logout());
  };
}

// - Signup Action -

function signupRequest() {
  return {
    type: AUTH.SIGNUP.REQUEST,
  };
}

function signupSuccess(response) {
  return {
    type: AUTH.SIGNUP.SUCCESS,
    result: response.data,
  };
}

function signupFailure(error) {
  return {
    type: AUTH.SIGNUP.FAILURE,
    error: error.message,
  };
}

export function signup(person) {
  return (dispatch) => {
    dispatch(signupRequest());
    return new Promise((resolve, reject) => {
      auth.signup(person)
        .then((response) => {
          dispatch(signupSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(signupFailure(response));
          return reject(response);
        });
    }).catch((error) => {
      console.log(error);
      // throw new Error(error);
    });
  };
}

// -- Reset Password

function resetPasswordRequest() {
  return {
    type: AUTH.PASSWORD_RESET.REQUEST,
  };
}

function resetPasswordSuccess(response) {
  return {
    type: AUTH.PASSWORD_RESET.SUCCESS,
    status: response.status,
  };
}

function resetPasswordFailure(error) {
  return {
    type: AUTH.PASSWORD_RESET.FAILURE,
    error: error.message,
  };
}

export function resetPassword(person) {
  return (dispatch) => {
    dispatch(resetPasswordRequest());
    return new Promise((resolve, reject) => {
      auth.resetPassword(person)
        .then((response) => {
          dispatch(resetPasswordSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(resetPasswordFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
