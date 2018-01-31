import { people as api } from '../api';
import {
  PERSON_READ_REQUEST, PERSON_READ_SUCCESS, PERSON_READ_FAILURE,
  // PERSON_EDIT_REQUEST, PERSON_EDIT_SUCCESS, PERSON_EDIT_FAILURE,
  // PERSON_ADD_REQUEST, PERSON_ADD_SUCCESS, PERSON_ADD_FAILURE,
  PERSON_DELETE_REQUEST, PERSON_DELETE_SUCCESS, PERSON_DELETE_FAILURE,
  PERSON_FOLLOW_REQUEST, PERSON_FOLLOW_SUCCESS, PERSON_FOLLOW_FAILURE,
  PERSON_UNFOLLOW_REQUEST, PERSON_UNFOLLOW_SUCCESS, PERSON_UNFOLLOW_FAILURE,
} from '../constants/person';

// -- Read

function readRequest(id) {
  return {
    type: PERSON_READ_REQUEST,
    id,
  };
}

function readSuccess(person) {
  return {
    type: PERSON_READ_SUCCESS,
    person,
  };
}

function readFailure(error) {
  return {
    type: PERSON_READ_FAILURE,
    errorMessage: error.message,
  };
}

export function readPerson(id) {
  return (dispatch) => {
    dispatch(readRequest(id));
    return new Promise((resolve, reject) => {
      api.readPerson()
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

// -- Edit

// -- Add

// -- Delete

function deleteRequest(person) {
  return {
    type: PERSON_DELETE_REQUEST,
    person,
  };
}

function deleteSuccess(response) {
  return {
    type: PERSON_DELETE_SUCCESS,
    response,
  };
}

function deleteFailure(error) {
  return {
    type: PERSON_DELETE_FAILURE,
    errorMessage: error.message,
  };
}

export function deletePerson(person) {
  return (dispatch) => {
    dispatch(deleteRequest(person));
    return new Promise((resolve, reject) => {
      api.readPerson()
        .then((result) => {
          dispatch(deleteSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Follow

function followRequest(person) {
  return {
    type: PERSON_FOLLOW_REQUEST,
    person,
  };
}

function followSuccess(response) {
  return {
    type: PERSON_FOLLOW_SUCCESS,
    person: response,
  };
}

function followFailure(error) {
  return {
    type: PERSON_FOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function followPerson(viewer, person) {
  return (dispatch) => {
    dispatch(followRequest(person));
    return new Promise((resolve, reject) => {
      api.followPerson(viewer, person)
        .then((result) => {
          dispatch(followSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(followFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Unfollow

function unfollowRequest(person) {
  return {
    type: PERSON_UNFOLLOW_REQUEST,
    person,
  };
}

function unfollowSuccess(response) {
  return {
    type: PERSON_UNFOLLOW_SUCCESS,
    person: response,
  };
}

function unfollowFailure(error) {
  return {
    type: PERSON_UNFOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function unfollowPerson(viewer, person) {
  return (dispatch) => {
    dispatch(unfollowRequest(person));
    return new Promise((resolve, reject) => {
      api.unfollowPerson(viewer, person)
        .then((result) => {
          dispatch(unfollowSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(unfollowFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
