import { normalize, schema } from 'normalizr';
import { stories as api } from '../api';

import { Stories as STORIES } from '../constants';

// -- reset

function reset() {
  return {
    type: STORIES.BROWSE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: STORIES.BROWSE.REQUEST,
  };
}

// @todo move these to utils

const normalizeNodes = (data, namespace) => {
  const node = new schema.Entity(namespace);
  const nodes = [node];
  return normalize(data, nodes);
};

const normalizeNodesComments = (nodes) => {
  return [...nodes].map((n) => {
    const node = { ...n };
    if (node.comments) {
      const normalized = normalizeNodes(node.comments, 'comments');
      node.comments = {
        byId: normalized.entities.comments,
        allIds: normalized.result,
      };
    } else {
      node.comments = {
        byId: {},
        allIds: [],
      };
    }
    return node;
  });
};

function browseSuccess(results) {
  const { data } = results;
  const { pagination } = data;

  const stories = normalizeNodesComments(data.data);
  const normalized = normalizeNodes(stories, 'stories');
  const hasMore = data.data.length >= pagination.limit;

  return {
    type: STORIES.BROWSE.SUCCESS,
    stories: normalized.entities.stories,
    ids: normalized.result,
    total: pagination.total,
    hasMore,
  };
}

function browseFailure(error) {
  return {
    type: STORIES.BROWSE.FAILURE,
    error: error.message,
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
          // throw new Error(error);
          console.error(error);
        });
    });
  };
}

// -- Delete

function deleteRequest(story) {
  return {
    type: STORIES.DELETE.REQUEST,
    story,
  };
}

function deleteSuccess(result) {
  return {
    type: STORIES.DELETE.SUCCESS,
    status: result.status,
  };
}

function deleteFailure(response) {
  return {
    type: STORIES.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteItem(story) {
  return (dispatch) => {
    dispatch(deleteRequest(story));
    return new Promise((resolve, reject) => {
      api.deleteItem(story)
        .then((result) => {
          dispatch(deleteSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteFailure(response));
          return reject(response);
        }).catch((error) => {
          // throw new Error(error);
          console.error(error);
        });
    });
  };
}

export default {
  reset,
  browse,
  deleteItem,
};
