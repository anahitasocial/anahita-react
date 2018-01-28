import { people as api } from '../api';
import {
  PERSON_BROWSE_REQUEST, PERSON_BROWSE_SUCCESS, PERSON_BROWSE_FAILURE,
  PERSON_READ_REQUEST, PERSON_READ_SUCCESS, PERSON_READ_FAILURE,
//  PERSON_EDIT_REQUEST, PERSON_EDIT_SUCCESS, PERSON_EDIT_FAILURE,
//  PERSON_ADD_REQUEST, PERSON_ADD_SUCCESS, PERSON_ADD_FAILURE,
  PERSON_DELETE_REQUEST, PERSON_DELETE_SUCCESS, PERSON_DELETE_FAILURE,
} from '../constants/people';

// -- Browse

function browsePersonRequest() {
  return {
    type: PERSON_BROWSE_REQUEST,
  };
}

function browsePersonSuccess(results) {
  return {
    type: PERSON_BROWSE_SUCCESS,
    people: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browsePersonFailure(error) {
  return {
    type: PERSON_BROWSE_FAILURE,
    errorMessage: error.message,
  };
}

export function browsePeople(params) {
  return (dispatch) => {
    dispatch(browsePersonRequest());
    return new Promise((resolve, reject) => {
      api.browsePeople(params)
        .then((result) => {
          dispatch(browsePersonSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(browsePersonFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Read

function readPersonRequest(id) {
  return {
    type: PERSON_READ_REQUEST,
    id,
  };
}

function readPersonSuccess(person) {
  return {
    type: PERSON_READ_SUCCESS,
    person,
  };
}

function readPersonFailure(error) {
  return {
    type: PERSON_READ_FAILURE,
    errorMessage: error.message,
  };
}

export function readPerson(id) {
  return (dispatch) => {
    dispatch(readPersonRequest(id));
    return new Promise((resolve, reject) => {
      api.readPerson()
        .then((result) => {
          dispatch(readPersonSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(readPersonFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Edit

// -- Add

// -- Delete

function deletePersonRequest(person) {
  return {
    type: PERSON_DELETE_REQUEST,
    person,
  };
}

function deletePersonSuccess(response) {
  return {
    type: PERSON_DELETE_SUCCESS,
    response,
  };
}

function deletePersonFailure(error) {
  return {
    type: PERSON_DELETE_FAILURE,
    errorMessage: error.message,
  };
}

export function deletePerson(person) {
  return (dispatch) => {
    dispatch(deletePersonRequest(person));
    return new Promise((resolve, reject) => {
      api.readPerson()
        .then((result) => {
          dispatch(deletePersonSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deletePersonFailure(response));
          return reject(response);
        }).catch((error) => {
          dispatch(deletePersonFailure(error));
        });
    });
  };
}
