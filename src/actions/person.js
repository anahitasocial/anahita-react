import { person as api } from '../api';
import { Person as PERSON } from '../constants';

// -- Read

function readRequest() {
  return {
    type: PERSON.READ.REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: PERSON.READ.SUCCESS,
    person: result.data,
  };
}

function readFailure(response) {
  return {
    type: PERSON.READ.FAILURE,
    error: response.message,
  };
}

export function readPerson(id) {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.readPerson(id)
        .then((result) => {
          dispatch(readSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(readFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Edit Person

function editRequest(person) {
  return {
    type: PERSON.EDIT.REQUEST,
    person,
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
    dispatch(editRequest(person));
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
