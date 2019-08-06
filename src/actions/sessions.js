/* global localStorage */
import { sessions as api } from '../api';
import { Sessions as SESSIONS } from '../constants';

function reset() {
  return {
    type: SESSIONS.RESET,
  };
}

// - Read Action -

function readRequest() {
  return {
    type: SESSIONS.READ.REQUEST,
  };
}

function readSuccess(response) {
  const { data } = response;
  localStorage.setItem('viewer', JSON.stringify(data));
  return {
    type: SESSIONS.READ.SUCCESS,
    viewer: data,
  };
}

function readFailure(error) {
  return {
    type: SESSIONS.READ.FAILURE,
    error: error.message,
  };
}

function read(credentials) {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.add(credentials)
        .then((response) => {
          dispatch(readSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(readFailure(response));
          return reject(response);
        });
    }).catch((error) => {
      console.error(error);
    });
  };
}

// - Add Action -

function addRequest() {
  return {
    type: SESSIONS.ADD.REQUEST,
  };
}

function addSuccess(response) {
  const { data } = response;
  localStorage.setItem('viewer', JSON.stringify(data));
  return {
    type: SESSIONS.ADD.SUCCESS,
    viewer: data,
  };
}

function addFailure(error) {
  return {
    type: SESSIONS.ADD.FAILURE,
    error: error.message,
  };
}

function add(credentials) {
  return (dispatch) => {
    dispatch(addRequest());
    return new Promise((resolve, reject) => {
      api.add(credentials)
        .then((response) => {
          dispatch(addSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(addFailure(response));
          return reject(response);
        });
    }).catch((error) => {
      console.error(error);
    });
  };
}

// - Delete Action -

function deleteRequest() {
  return {
    type: SESSIONS.DELETE.REQUEST,
  };
}

function deleteSuccess(response) {
  const { data } = response;
  localStorage.removeItem('viewer');
  return {
    type: SESSIONS.DELETE.SUCCESS,
    viewer: data,
  };
}

function deleteFailure(error) {
  return {
    type: SESSIONS.DELETE.FAILURE,
    error: error.message,
  };
}

function deleteItem() {
  return (dispatch) => {
    dispatch(deleteRequest());
    return new Promise((resolve, reject) => {
      api.deleteItem()
        .then((response) => {
          dispatch(deleteSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(deleteFailure(response));
          return reject(response);
        });
    }).catch((error) => {
      console.error(error);
    });
  };
}

export default {
  reset,
  read,
  add,
  deleteItem,
};
