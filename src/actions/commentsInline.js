import { normalize, schema } from 'normalizr';
import {
  comments as commentsApi,
  likes as likesApi,
} from '../api';
import { CommentsInline as COMMENTS_INLINE } from '../constants';
import createLikes from './createLikes';

// --- setList

const setList = () => {
  return (comments, parent) => {
    return {
      type: COMMENTS_INLINE.BROWSE.SET,
      comments,
      parent,
    };
  };
};

// -- reset

const reset = () => {
  return {
    type: COMMENTS_INLINE.RESET,
  };
};

// -- Browse

function browseRequest() {
  return {
    type: COMMENTS_INLINE.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const { data } = results;
  const comment = new schema.Entity('comments');
  const comments = [comment];
  const normalized = normalize(data.comments || [], comments);

  return {
    type: COMMENTS_INLINE.BROWSE.SUCCESS,
    comments: normalized.entities.comments,
    ids: normalized.result,
  };
}

function browseFailure(error) {
  return {
    type: COMMENTS_INLINE.BROWSE.FAILURE,
    errorMessage: error.message,
  };
}

const browse = (api) => {
  return (params) => {
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
  };
};


// -- Edit

function editRequest(comment) {
  return {
    type: COMMENTS_INLINE.EDIT.REQUEST,
    comment,
  };
}

function editSuccess(result) {
  return {
    type: COMMENTS_INLINE.EDIT.SUCCESS,
    comment: result.data,
  };
}

function editFailure(error) {
  return {
    type: COMMENTS_INLINE.EDIT.FAILURE,
    error: error.message,
  };
}

const edit = (api) => {
  return (comment) => {
    return (dispatch) => {
      dispatch(editRequest(comment));
      return new Promise((resolve, reject) => {
        api.edit(comment)
          .then((result) => {
            dispatch(editSuccess(result));
            return resolve();
          }, (response) => {
            dispatch(editFailure(response));
            return reject(response);
          }).catch((error) => {
            // throw new Error(error);
            console.error(error);
          });
      });
    };
  };
};

// -- Add

function addRequest(comment) {
  return {
    type: COMMENTS_INLINE.ADD.REQUEST,
    comment,
  };
}

function addSuccess(result) {
  return {
    type: COMMENTS_INLINE.ADD.SUCCESS,
    comment: result.data,
  };
}

function addFailure(error) {
  return {
    type: COMMENTS_INLINE.ADD.FAILURE,
    error: error.message,
  };
}

const add = (api) => {
  return (comment) => {
    return (dispatch) => {
      dispatch(addRequest(comment));
      return new Promise((resolve, reject) => {
        api.add(comment)
          .then((result) => {
            dispatch(addSuccess(result));
            return resolve();
          }, (response) => {
            dispatch(addFailure(response));
            return reject(response);
          }).catch((error) => {
            // throw new Error(error);
            console.error(error);
          });
      });
    };
  };
};

// -- Delete

function deleteRequest(comment) {
  return {
    type: COMMENTS_INLINE.DELETE.REQUEST,
    comment,
  };
}

function deleteSuccess(comment) {
  return {
    type: COMMENTS_INLINE.DELETE.SUCCESS,
    comment,
  };
}

function deleteFailure(response) {
  return {
    type: COMMENTS_INLINE.DELETE.FAILURE,
    error: response.message,
  };
}

const deleteItem = (api) => {
  return (comment) => {
    return (dispatch) => {
      dispatch(deleteRequest(comment));
      return new Promise((resolve, reject) => {
        api.deleteItem(comment)
          .then(() => {
            dispatch(deleteSuccess(comment));
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
  };
};

export default (namespace) => {
  const api = commentsApi(namespace);
  return {
    setList: setList(),
    reset: reset(),
    browse: browse(api),
    edit: edit(api),
    add: add(api),
    deleteItem: deleteItem(api),
    likes: createLikes('comments_inline')(likesApi),
  };
};
