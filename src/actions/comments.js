import { normalize, schema } from 'normalizr';
import { comments as api } from '../api';
import { Comments as COMMENTS } from '../constants';

// -- reset

function reset() {
  return {
    type: COMMENTS.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: COMMENTS.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const { data } = results;
  const comment = new schema.Entity('comments');
  const comments = [comment];
  const normalized = normalize(data.comments || [], comments);

  return {
    type: COMMENTS.BROWSE.SUCCESS,
    comments: normalized.entities.comments,
    ids: normalized.result,
  };
}

function browseFailure(error) {
  return {
    type: COMMENTS.BROWSE.FAILURE,
    errorMessage: error.message,
  };
}

function browse(params) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browse(params)
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

// -- Add

function addRequest(comment) {
  return {
    type: COMMENTS.ADD.REQUEST,
    comment,
  };
}

function addSuccess(result) {
  return {
    type: COMMENTS.ADD.SUCCESS,
    comment: result.data,
  };
}

function addFailure(error) {
  return {
    type: COMMENTS.ADD.FAILURE,
    error: error.message,
  };
}

function add(comment, ticket) {
  return (dispatch) => {
    dispatch(addRequest(comment));
    return new Promise((resolve, reject) => {
      api.add(comment, ticket)
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

export default {
  reset,
  browse,
  add,
};
