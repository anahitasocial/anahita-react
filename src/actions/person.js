import { person as api } from '../api';
import { Person as PERSON } from '../constants';

// -- Validate Username Existence

function validateUsernameRequest() {
  return {
    type: PERSON.VALIDATE_USERNAME.REQUEST,
  };
}

function validateUsernameSuccess() {
  return {
    type: PERSON.VALIDATE_USERNAME.SUCCESS,
    isAvailable: true,
  };
}

function validateUsernameFailure(error) {
  return {
    type: PERSON.VALIDATE_USERNAME.FAILURE,
    error: error.message,
  };
}

export function validateUsername(username) {
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

// -- Validate Email Existence

function validateEmailRequest() {
  return {
    type: PERSON.VALIDATE_EMAIL.REQUEST,
  };
}

function validateEmailSucess() {
  return {
    type: PERSON.VALIDATE_EMAIL.SUCCESS,
    isAvailable: true,
  };
}

function validateEmailFailure(error) {
  return {
    type: PERSON.VALIDATE_EMAIL.FAILURE,
    error: error.message,
  };
}

export function validateEmail(email) {
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

// -- Edit Person

function editRequest() {
  return {
    type: PERSON.EDIT.REQUEST,
  };
}

function editSuccess(response) {
  return {
    type: PERSON.EDIT.SUCCESS,
    person: response.data,
  };
}

function editFailure(error) {
  return {
    type: PERSON.EDIT.FAILURE,
    error: error.message,
  };
}

export function editPerson(person) {
  return (dispatch) => {
    dispatch(editRequest());
    return new Promise((resolve, reject) => {
      api.editPerson(person)
        .then((result) => {
          dispatch(editSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(editFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Edit Account

function editAccountRequest() {
  return {
    type: PERSON.EDIT_ACCOUNT.REQUEST,
  };
}

function editAccountSuccess(response) {
  return {
    type: PERSON.EDIT_ACCOUNT.SUCCESS,
    person: response.data,
  };
}

function editAccountFailure(error) {
  return {
    type: PERSON.EDIT_ACCOUNT.FAILURE,
    error: error.message,
  };
}

export function editPersonAccount(person) {
  return (dispatch) => {
    dispatch(editAccountRequest());
    return new Promise((resolve, reject) => {
      api.editPersonAccount(person)
        .then((result) => {
          dispatch(editAccountSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(editAccountFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Add Person

function addRequest() {
  return {
    type: PERSON.ADD.REQUEST,
  };
}

function addSuccess(response) {
  return {
    type: PERSON.ADD.SUCCESS,
    person: response.data,
  };
}

function addFailure(error) {
  return {
    type: PERSON.ADD.FAILURE,
    error: error.message,
  };
}

export function addPerson(person) {
  return (dispatch) => {
    dispatch(addRequest());
    return new Promise((resolve, reject) => {
      api.addPerson(person)
        .then((result) => {
          dispatch(addSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(addFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
