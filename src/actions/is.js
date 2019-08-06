import { is as api } from '../api';
import { Is as IS } from '../constants';

// - isEmail

function isEmailRequest() {
  return {
    type: IS.EMAIL.REQUEST,
  };
}

function isEmailSuccess() {
  return {
    type: IS.EMAIL.SUCCESS,
    isEmail: true,
  };
}

function isEmailFailure(error) {
  return {
    type: IS.EMAIL.FAILURE,
    error: error.message,
  };
}

function email(value) {
  return (dispatch) => {
    dispatch(isEmailRequest());
    return new Promise((resolve, reject) => {
      api.email(value)
        .then(() => {
          dispatch(isEmailSuccess());
          return resolve();
        }, (response) => {
          dispatch(isEmailFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// - isUsername

function isUsernameRequest() {
  return {
    type: IS.USERNAME.REQUEST,
  };
}

function isUsernameSuccess() {
  return {
    type: IS.USERNAME.SUCCESS,
    isEmail: true,
  };
}

function isUsernameFailure(error) {
  return {
    type: IS.USERNAME.FAILURE,
    error: error.message,
  };
}

function username(value) {
  return (dispatch) => {
    dispatch(isUsernameRequest());
    return new Promise((resolve, reject) => {
      api.username(value)
        .then(() => {
          dispatch(isUsernameSuccess());
          return resolve();
        }, (response) => {
          dispatch(isUsernameFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

export default {
  email,
  username,
};
