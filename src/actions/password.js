import apis from '../api';
import { Password as PASSWORD } from '../constants';

const { password: api } = apis;

// - Reset Action -

function resetRequest() {
  return {
    type: PASSWORD.RESET.REQUEST,
  };
}

function resetSuccess(response) {
  const { status } = response;
  return {
    type: PASSWORD.RESET.SUCCESS,
    status,
  };
}

function resetFailure(error) {
  return {
    type: PASSWORD.RESET.FAILURE,
    error: error.message,
  };
}

function reset(person) {
  return (dispatch) => {
    dispatch(resetRequest());
    return new Promise((resolve, reject) => {
      api.reset(person)
        .then((response) => {
          dispatch(resetSuccess(response));
          return resolve();
        }, (response) => {
          dispatch(resetFailure(response));
          return reject(response);
        });
    }).catch((error) => {
      console.error(error);
    });
  };
}

export default {
  reset,
};
