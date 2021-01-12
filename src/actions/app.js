import { v4 as uuidv4 } from 'uuid';
import { App as APP } from '../constants';

const setAppTitle = (title) => {
  return {
    type: APP.TITLE.UPDATE,
    title,
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
  setAppTitle,
  alert: {
    error: addError,
    warning: addWarning,
    info: addInfo,
    success: addSuccess,
  },
  deleteAlert,
};
