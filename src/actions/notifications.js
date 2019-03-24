import { notifications as api } from '../api';
import { Notifications as NOTIFICATIONS } from '../constants';

// -- add subscription

function addRequest() {
  return {
    type: NOTIFICATIONS.ADD.REQUEST,
  };
}

function addSuccess() {
  return {
    type: NOTIFICATIONS.ADD.SUCCESS,
  };
}

function addFailure(error) {
  return {
    type: NOTIFICATIONS.ADD.SUCCESS,
    error: error.message,
  };
}

function add(node) {
  return (dispatch) => {
    dispatch(addRequest());
    return new Promise((resolve, reject) => {
      api.add(node)
        .then(() => {
          dispatch(addSuccess());
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

// -- delete subscription

function deleteRequest() {
  return {
    type: NOTIFICATIONS.DELETE.REQUEST,
  };
}

function deleteSuccess() {
  return {
    type: NOTIFICATIONS.DELETE.SUCCESS,
  };
}

function deleteFailure(error) {
  return {
    type: NOTIFICATIONS.DELETE.FAILURE,
    error: error.message,
  };
}

function deleteItem(node) {
  return (dispatch) => {
    dispatch(deleteRequest());
    return new Promise((resolve, reject) => {
      api.deleteItem(node)
        .then(() => {
          dispatch(deleteSuccess());
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
  add,
  deleteItem,
};
