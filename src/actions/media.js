import { normalize, schema } from 'normalizr';
import { media as api } from '../api';
import { Media as MEDIA } from '../constants';

// -- reset

export function resetMedia() {
  return {
    type: MEDIA.BROWSE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: MEDIA.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const medium = new schema.Entity('media');
  const media = [medium];
  const normalized = normalize(results.data.data, media);

  return {
    type: MEDIA.BROWSE.SUCCESS,
    media: normalized.entities.media,
    ids: normalized.result,
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
