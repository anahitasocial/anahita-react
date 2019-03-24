import { normalize, schema } from 'normalizr';
import { actors as api } from '../api';
import { Actors as ACTORS } from '../constants';

// -- reset

function reset() {
  return {
    type: ACTORS.BROWSE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: ACTORS.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const { data } = results;
  const { pagination } = data;

  const actor = new schema.Entity('actors');
  const actors = [actor];
  const normalized = normalize(data.data, actors);
  const hasMore = data.data.length >= pagination.limit;

  return {
    type: ACTORS.BROWSE.SUCCESS,
    actors: normalized.entities.actors,
    ids: normalized.result,
    total: results.data.pagination.total,
    hasMore,
  };
}

function browseFailure(error) {
  return {
    type: ACTORS.BROWSE.FAILURE,
    error: error.message,
  };
}

function browse(params, namespace) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browse(params, namespace)
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

// -- Read

function readRequest() {
  return {
    type: ACTORS.READ.REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: ACTORS.READ.SUCCESS,
    actor: result.data,
  };
}

function readFailure(response) {
  return {
    type: ACTORS.READ.FAILURE,
    error: response.message,
  };
}

function read(id, namespace) {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.read(id, namespace)
        .then((result) => {
          dispatch(readSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(readFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Edit

function editRequest(actor) {
  return {
    type: ACTORS.EDIT.REQUEST,
    actor,
  };
}

function editSuccess(result) {
  return {
    type: ACTORS.EDIT.SUCCESS,
    actor: result.data,
  };
}

function editFailure(response) {
  return {
    type: ACTORS.EDIT.FAILURE,
    error: response.message,
  };
}

function edit(actor) {
  return (dispatch) => {
    dispatch(editRequest(actor));
    return new Promise((resolve, reject) => {
      api.edit(actor)
        .then((result) => {
          dispatch(editSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(editFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Add

function addRequest(actor) {
  return {
    type: ACTORS.ADD.REQUEST,
    actor,
  };
}

function addSuccess(result) {
  return {
    type: ACTORS.ADD.SUCCESS,
    actor: result.data,
  };
}

function addFailure(response) {
  return {
    type: ACTORS.ADD.FAILURE,
    error: response.message,
  };
}

function add(actor, namespace) {
  return (dispatch) => {
    dispatch(addRequest(actor));
    return new Promise((resolve, reject) => {
      api.add(actor, namespace)
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

// -- Delete

function deleteRequest(actor) {
  return {
    type: ACTORS.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(result) {
  return {
    type: ACTORS.DELETE.SUCCESS,
    status: result.status,
    actor: null,
  };
}

function deleteFailure(response) {
  return {
    type: ACTORS.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteItem(actor) {
  return (dispatch) => {
    dispatch(deleteRequest(actor));
    return new Promise((resolve, reject) => {
      api.deleteItem(actor)
        .then((result) => {
          dispatch(deleteSuccess(result));
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
  reset,
  browse,
  read,
  edit,
  add,
  deleteItem,
};
