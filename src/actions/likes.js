import { normalize, schema } from 'normalizr';
import { likes as api } from '../api';
import { Likes as LIKES } from '../constants';

// -- browse likers

function browseRequest() {
  return {
    type: LIKES.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const { data } = results;
  const person = new schema.Entity('people');
  const people = [person];
  const normalized = normalize(data.data, people);

  return {
    type: LIKES.BROWSE.SUCCESS,
    people: normalized.entities.people,
    ids: normalized.result,
  };
}

function browseFailure(error) {
  return {
    type: LIKES.BROWSE.FAILURE,
    error: error.message,
  };
}

function browse(node) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browse(node)
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

// -- add like

function addRequest() {
  return {
    type: LIKES.ADD.REQUEST,
  };
}

function addSuccess() {
  return {
    type: LIKES.ADD.SUCCESS,
  };
}

function addFailure(error) {
  return {
    type: LIKES.ADD.SUCCESS,
    error: error.message,
  };
}

function add(node) {
  return (dispatch) => {
    dispatch(addRequest());
    return new Promise((resolve, reject) => {
      api.add(node)
        .then(() => {
          dispatch(addSuccess());
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

// -- delete like

function deleteRequest() {
  return {
    type: LIKES.DELETE.REQUEST,
  };
}

function deleteSuccess() {
  return {
    type: LIKES.DELETE.SUCCESS,
  };
}

function deleteFailure(error) {
  return {
    type: LIKES.DELETE.FAILURE,
    error: error.message,
  };
}

function deleteItem(node) {
  return (dispatch) => {
    dispatch(deleteRequest());
    return new Promise((resolve, reject) => {
      api.deleteItem(node)
        .then(() => {
          dispatch(deleteSuccess());
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

export default {
  browse,
  add,
  deleteItem,
};
