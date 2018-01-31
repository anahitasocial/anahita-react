import { people as api } from '../api';
import {
  PERSON_BROWSE_REQUEST, PERSON_BROWSE_SUCCESS, PERSON_BROWSE_FAILURE,
  PERSON_READ_REQUEST, PERSON_READ_SUCCESS, PERSON_READ_FAILURE,
  // PERSON_EDIT_REQUEST, PERSON_EDIT_SUCCESS, PERSON_EDIT_FAILURE,
  // PERSON_ADD_REQUEST, PERSON_ADD_SUCCESS, PERSON_ADD_FAILURE,
  PERSON_DELETE_REQUEST, PERSON_DELETE_SUCCESS, PERSON_DELETE_FAILURE,
  PERSON_FOLLOW_REQUEST, PERSON_FOLLOW_SUCCESS, PERSON_FOLLOW_FAILURE,
  PERSON_UNFOLLOW_REQUEST, PERSON_UNFOLLOW_SUCCESS, PERSON_UNFOLLOW_FAILURE,
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
          throw new Error(error);
        });
    });
  };
}

// -- Follow

function followPersonRequest(person) {
  return {
    type: PERSON_FOLLOW_REQUEST,
    person,
  };
}

function followPersonSuccess(response) {
  return {
    type: PERSON_FOLLOW_SUCCESS,
    response,
  };
}

function followPersonFailure(error) {
  return {
    type: PERSON_FOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function followPerson(viewer, person) {
  return (dispatch) => {
    dispatch(followPersonRequest(person));
    return new Promise((resolve, reject) => {
      api.followPerson(viewer, person)
        .then((result) => {
          dispatch(followPersonSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(followPersonFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Unfollow

function unfollowPersonRequest(person) {
  return {
    type: PERSON_UNFOLLOW_REQUEST,
    person,
  };
}

function unfollowPersonSuccess(response) {
  return {
    type: PERSON_UNFOLLOW_SUCCESS,
    response,
  };
}

function unfollowPersonFailure(error) {
  return {
    type: PERSON_UNFOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function unfollowPerson(viewer, person) {
  return (dispatch) => {
    dispatch(unfollowPersonRequest(person));
    return new Promise((resolve, reject) => {
      api.unfollowPerson(viewer, person)
        .then((result) => {
          dispatch(unfollowPersonSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(unfollowPersonFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
