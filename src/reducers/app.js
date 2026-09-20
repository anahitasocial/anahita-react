import _ from 'lodash';
import { App as APP } from '../constants';
import NODE_INFO_DEFAULT from '../proptypes/NodeInfoDefault';

export default (state = {
  appBarTitle: '',
  alerts: [],
  // Seeded with the empty document rather than null, so a consumer can
  // reach through metadata.invitesFrom before the request has answered
  // without guarding every hop. The empty value means "not known yet",
  // and every reader treats that as the closed answer.
  nodeInfo: NODE_INFO_DEFAULT,
}, action) => {
  switch (action.type) {
    case APP.NODE_INFO.READ:
      return {
        ...state,
        nodeInfo: action.nodeInfo,
      };
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
