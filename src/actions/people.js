import { people as api } from '../api';
import { People as PEOPLE } from '../constants';

// -- reset

export function resetPeople() {
  return {
    type: PEOPLE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: PEOPLE.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  return {
    type: PEOPLE.BROWSE.SUCCESS,
    people: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: PEOPLE.BROWSE.FAILURE,
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
