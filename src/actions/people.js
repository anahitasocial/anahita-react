import { people as api } from '../api';
import {
  PEOPLE_RESET,
  PEOPLE_BROWSE_REQUEST, PEOPLE_BROWSE_SUCCESS, PEOPLE_BROWSE_FAILURE,
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
