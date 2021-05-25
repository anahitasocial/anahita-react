import { normalize, schema } from 'normalizr';
import apis from '../api';
import { CommentsInline as COMMENTS_INLINE } from '../constants';
import likes from './likes';

const {
  comments: commentsApi,
  likes: likesApi,
} = apis;

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

function editRequest() {
  return {
    type: COMMENTS_INLINE.EDIT.REQUEST,
  };
}

function editSuccess(result) {
  return {
    type: COMMENTS_INLINE.EDIT.SUCCESS,
    node: result.data,
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
      dispatch(editRequest());
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

function addRequest() {
  return {
    type: COMMENTS_INLINE.ADD.REQUEST,
  };
}

function addSuccess(result) {
  return {
    type: COMMENTS_INLINE.ADD.SUCCESS,
    node: result.data,
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
      dispatch(addRequest());
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

function deleteRequest() {
  return {
    type: COMMENTS_INLINE.DELETE.REQUEST,
  };
}

function deleteSuccess(comment) {
  return {
    type: COMMENTS_INLINE.DELETE.SUCCESS,
    node: comment,
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
      dispatch(deleteRequest());
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
    likes: likes.commentsInline(likesApi),
  };
};
