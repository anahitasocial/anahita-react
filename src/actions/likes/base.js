/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import { normalize, schema } from 'normalizr';

const reset = () => {
  return () => {
    return {
      type: 'LIKES_BROWSE_RESET',
    };
  };
};

// -- browse likers

const browseRequest = () => {
  return {
    type: 'LIKES_BROWSE_REQUEST',
  };
};

const browseSuccess = (results) => {
  const { data } = results;

  const person = new schema.Entity('people');
  const people = [person];
  const normalized = normalize(data.data, people);

  return {
    type: 'LIKES_BROWSE_SUCCESS',
    likes: normalized.entities.people,
    ids: normalized.result,
  };
};

const browseFailure = (response) => {
  return {
    type: 'LIKES_BROWSE_FAILURE',
    error: response.message,
  };
};

const browse = (api) => {
  return (node) => {
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
            console.error(error);
          });
      });
    };
  };
};

export default {
  browse,
  reset,
};
