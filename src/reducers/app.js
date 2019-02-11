import { App as APP } from '../constants';

export default function (state = {
  appBarTitle: '',
}, action) {
  switch (action.type) {
    case APP.TITLE.UPDATE:
      return {
        ...state,
        appBarTitle: action.title,
      };
    default:
      return state;
  }
}
