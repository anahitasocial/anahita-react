import { v4 as uuidv4 } from 'uuid';
import { App as APP } from '../constants';
import api from '../api';

// What this installation says about itself, read once and shared.
//
// Three screens already fetched NodeInfo independently — the login
// page, the support page and the settings About tab — because each
// needed one field from it. The left menu now needs one too, and a
// menu cannot sensibly own a network request.
//
// So it lands in the store: one read at startup, everybody reads the
// same answer. The three existing callers are left alone; they each
// want it at a moment when the store may not have answered yet, and
// none of them is worth the coupling.
//
// Failure is swallowed on purpose. Every consumer has a sane default
// for "we do not know" — the menu hides an entry, About says the
// document was not returned — and an alert about a document nobody
// asked for would be noise on a page that otherwise works.
const readNodeInfo = () => {
  return (dispatch) => {
    return api.nodeInfo.read()
      .then(({ data }) => {
        return dispatch({
          type: APP.NODE_INFO.READ,
          nodeInfo: data,
        });
      })
      .catch(() => {
        return null;
      });
  };
};

const addAlert = (body, severity) => {
  return {
    type: APP.ALERT.ADD,
    id: uuidv4(),
    body,
    severity,
  };
};

const addError = (body) => {
  return addAlert(body, 'error');
};

const addWarning = (body) => {
  return addAlert(body, 'warning');
};

const addInfo = (body) => {
  return addAlert(body, 'info');
};

const addSuccess = (body) => {
  return addAlert(body, 'success');
};

const deleteAlert = (id) => {
  return {
    type: APP.ALERT.DELETE,
    id,
  };
};

export default {
  readNodeInfo,
  alert: {
    error: addError,
    warning: addWarning,
    info: addInfo,
    success: addSuccess,
  },
  deleteAlert,
};
