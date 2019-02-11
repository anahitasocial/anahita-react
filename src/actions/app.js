import { App as APP } from '../constants';

const setAppTitle = (title) => {
  return {
    type: APP.TITLE.UPDATE,
    title,
  };
};

export default {
  setAppTitle,
};
