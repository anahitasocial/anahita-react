/* global localStorage */
import { auth as api } from '../api';
import { Auth as AUTH } from '../constants';

function reset() {
  return {
    type: AUTH.RESET,
  };
}

// -- Validate Username Reset

function validateUsernameReset() {
  return {
    type: AUTH.VALIDATE.USERNAME.RESET,
  };
}

// -- Validate Username Existence

function validateUsernameRequest() {
  return {
    type: AUTH.VALIDATE.USERNAME.REQUEST,
  };
}

function validateUsernameSuccess() {
  return {
    type: AUTH.VALIDATE.USERNAME.SUCCESS,
    isAvailable: true,
  };
}

function validateUsernameFailure(error) {
  return {
    type: AUTH.VALIDATE.USERNAME.FAILURE,
    error: error.message,
  };
}

function validateUsername(username) {
  return (dispatch) => {
    dispatch(validateUsernameRequest());
    return new Promise((resolve, reject) => {
      api.validateField('username', username)
        .then(() => {
          dispatch(validateUsernameSuccess());
          return resolve();
        }, (response) => {
          dispatch(validateUsernameFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Validate Email Reset

function validateEmailReset() {
  return {
    type: AUTH.VALIDATE.EMAIL.RESET,
  };
}

// -- Validate Email Existence

function validateEmailRequest() {
  return {
    type: AUTH.VALIDATE.EMAIL.REQUEST,
  };
}

function validateEmailSucess() {
  return {
    type: AUTH.VALIDATE.EMAIL.SUCCESS,
    isAvailable: true,
  };
}

function validateEmailFailure(error) {
  return {
    type: AUTH.VALIDATE.EMAIL.FAILURE,
    error: error.message,
  };
}

function validateEmail(email) {
  return (dispatch) => {
    dispatch(validateEmailRequest());
    return new Promise((resolve, reject) => {
      api.validateField('email', email)
        .then(() => {
          dispatch(validateEmailSucess());
          return resolve();
        }, (response) => {
          dispatch(validateEmailFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
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

function signup(person) {
  return (dispatch) => {
    dispatch(signupRequest());
    return new Promise((resolve, reject) => {
      api.signup(person)
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
    type: AUTH.PASSWORD.RESET.REQUEST,
  };
}

function resetPasswordSuccess(response) {
  return {
    type: AUTH.PASSWORD.RESET.SUCCESS,
    status: response.status,
  };
}

function resetPasswordFailure(error) {
  return {
    type: AUTH.PASSWORD.RESET.FAILURE,
    error: error.message,
  };
}

function resetPassword(person) {
  return (dispatch) => {
    dispatch(resetPasswordRequest());
    return new Promise((resolve, reject) => {
      api.resetPassword(person)
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

export default {
  reset,
  validateUsernameReset,
  validateUsername,
  validateEmailReset,
  validateEmail,
  signup,
  resetPassword,
};
