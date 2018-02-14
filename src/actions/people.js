import { people as api } from '../api';
import {
  PEOPLE_RESET,
  PEOPLE_BROWSE_REQUEST, PEOPLE_BROWSE_SUCCESS, PEOPLE_BROWSE_FAILURE,
  PEOPLE_FOLLOW_REQUEST, PEOPLE_FOLLOW_SUCCESS, PEOPLE_FOLLOW_FAILURE,
  PEOPLE_UNFOLLOW_REQUEST, PEOPLE_UNFOLLOW_SUCCESS, PEOPLE_UNFOLLOW_FAILURE,
} from '../constants/people';

// -- reset

export function resetPeople() {
  return {
    type: PEOPLE_RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: PEOPLE_BROWSE_REQUEST,
  };
}

function browseSuccess(results) {
  return {
    type: PEOPLE_BROWSE_SUCCESS,
    people: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: PEOPLE_BROWSE_FAILURE,
    errorMessage: error.message,
  };
}

export function browsePeople(params) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browsePeople(params)
        .then((result) => {
          dispatch(browseSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(browseFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Follow

function followRequest() {
  return {
    type: PEOPLE_FOLLOW_REQUEST,
  };
}

function followSuccess(response) {
  return {
    type: PEOPLE_FOLLOW_SUCCESS,
    person: response.data,
  };
}

function followFailure(error) {
  return {
    type: PEOPLE_FOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function followPerson(viewer, person) {
  return (dispatch) => {
    dispatch(followRequest());
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

function unfollowRequest() {
  return {
    type: PEOPLE_UNFOLLOW_REQUEST,
  };
}

function unfollowSuccess(response) {
  return {
    type: PEOPLE_UNFOLLOW_SUCCESS,
    person: response.data,
  };
}

function unfollowFailure(error) {
  return {
    type: PEOPLE_UNFOLLOW_FAILURE,
    errorMessage: error.message,
  };
}

export function unfollowPerson(viewer, person) {
  return (dispatch) => {
    dispatch(unfollowRequest());
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
