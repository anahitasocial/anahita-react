import apis from '../api';
import { Signup as SIGNUP } from '../constants';

const { signup: api } = apis;

// - Add Action -

function addRequest() {
  return {
    type: SIGNUP.ADD.REQUEST,
  };
}

function addSuccess(response) {
  const { data } = response;
  return {
    type: SIGNUP.ADD.SUCCESS,
    result: data,
  };
}

function addFailure(error) {
  return {
    type: SIGNUP.ADD.FAILURE,
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

export default {
  add,
};
