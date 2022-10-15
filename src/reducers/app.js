import _ from 'lodash';
import { App as APP } from '../constants';

export default (state = {
  appBarTitle: '',
  alerts: [],
}, action) => {
  switch (action.type) {
    case APP.TITLE.UPDATE:
      return {
        ...state,
        appBarTitle: action.title,
      };
    case APP.ALERT.ADD:
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            id: action.id,
            body: action.body,
            severity: action.severity,
          },
        ],
      };
    case APP.ALERT.DELETE:
      return {
        ...state,
        alerts: _.filter(state.alerts, (alert) => {
          return alert.id !== action.id;
        }),
      };
    default:
      return state;
  }
};
