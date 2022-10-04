/* eslint-disable no-undef */
import apis from '../api';
import { Session as SESSION } from '../constants';

const { session: api } = apis;

function reset() {
  return {
    type: SESSION.RESET,
  };
}

// - Read Action -

function readRequest() {
  return {
    type: SESSION.READ.REQUEST,
  };
}

function readSuccess(response) {
  const { data } = response;
  localStorage.setItem('viewer', JSON.stringify(data));

  return {
    type: SESSION.READ.SUCCESS,
    viewer: data,
  };
}

function readFailure(error) {
  localStorage.removeItem('viewer');
  return {
    type: SESSION.READ.FAILURE,
    error: error.message,
  };
}

function read() {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.read()
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
    type: SESSION.ADD.REQUEST,
  };
}

function addSuccess(response) {
  const { data } = response;
  localStorage.setItem('viewer', JSON.stringify(data));

  return {
    type: SESSION.ADD.SUCCESS,
    viewer: data,
  };
}

function addFailure(error) {
  return {
    type: SESSION.ADD.FAILURE,
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
    type: SESSION.DELETE.REQUEST,
  };
}

function deleteSuccess(response) {
  const { data } = response;
  localStorage.removeItem('viewer');

  return {
    type: SESSION.DELETE.SUCCESS,
    viewer: data,
  };
}

function deleteFailure(error) {
  return {
    type: SESSION.DELETE.FAILURE,
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
