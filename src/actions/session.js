/* eslint-disable no-undef */
import apis from '../api';
import {
  Session as SESSION,
  Auth as AUTH,
} from '../constants';

const { VIEWER_STORAGE_KEY } = AUTH;
const { session: api } = apis;

function reset() {
  return { type: SESSION.RESET };
}

// Login redirects to OAuth flow - no dispatch needed
function add() {
  return () => {
    api.login();
  };
}

// Called from OAuthCallback component after code exchange
function handleCallback(code) {
  return (dispatch) => {
    dispatch({ type: SESSION.ADD.REQUEST });
    return api.exchangeCode(code)
      .then(() => {
        // No tokens to store — they're in the httpOnly cookie
        return api.read();
      })
      .then((response) => {
        const { data } = response;
        localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(data));
        dispatch({
          type: SESSION.ADD.SUCCESS,
          viewer: data,
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

// Read viewer from userinfo endpoint
function read() {
  return async (dispatch) => {
    dispatch({ type: SESSION.READ.REQUEST });
    try {
      const response = await api.read();
      const { data } = response;
      localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(data));
      dispatch({
        type: SESSION.READ.SUCCESS,
        viewer: data,
      });
    } catch (error) {
      localStorage.removeItem(VIEWER_STORAGE_KEY);
      dispatch({
        type: SESSION.READ.FAILURE,
        error: error.message,
      });
    }
  };
}

// Logout
function deleteItem() {
  return async (dispatch) => {
    dispatch({ type: SESSION.DELETE.REQUEST });
    try {
      await api.deleteItem();
      localStorage.removeItem(VIEWER_STORAGE_KEY);
      dispatch({ type: SESSION.DELETE.SUCCESS, viewer: {} });
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
