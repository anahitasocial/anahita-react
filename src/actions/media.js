import { media as api } from '../api';
import { Media as MEDIA } from '../constants';

// -- reset

export function resetMedia() {
  return {
    type: MEDIA.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: MEDIA.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  return {
    type: MEDIA.BROWSE.SUCCESS,
    media: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: MEDIA.BROWSE.FAILURE,
    error: error.message,
  };
}

export function browseMedia(params, namespace) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browseMedia(params, namespace)
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
