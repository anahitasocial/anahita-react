import apis from '../api';
import { Session as SESSION } from '../constants';

const { session: api } = apis;

function reset() {
  return { type: SESSION.RESET };
}

function add() {
  return () => {
    api.login();
  };
}

function handleCallback(code) {
  return (dispatch) => {
    dispatch({ type: SESSION.ADD.REQUEST });
    return api.exchangeCode(code)
      .then(() => {
        return api.read();
      })
      .then((response) => {
        dispatch({
          type: SESSION.ADD.SUCCESS,
          viewer: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: SESSION.ADD.FAILURE,
          error: error.message,
        });
      });
  };
}

function read() {
  return async (dispatch) => {
    dispatch({ type: SESSION.READ.REQUEST });
    try {
      const response = await api.read();
      dispatch({
        type: SESSION.READ.SUCCESS,
        viewer: response.data,
      });
    } catch (error) {
      dispatch({
        type: SESSION.READ.FAILURE,
        error: error.message,
      });
    }
  };
}

function deleteItem() {
  return async (dispatch) => {
    dispatch({ type: SESSION.DELETE.REQUEST });
    try {
      await api.deleteItem();
      dispatch({ type: SESSION.DELETE.SUCCESS });
    } catch (error) {
      dispatch({
        type: SESSION.DELETE.FAILURE,
        error: error.message,
      });
    }
  };
}

export default {
  reset,
  read,
  add,
  handleCallback,
  deleteItem,
};
