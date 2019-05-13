import createAction from './create';
import { hashtags as api } from '../api';

const namespace = 'hashtags';

export default {
  reset: () => {
    return createAction.reset(namespace);
  },
  browse: (params) => {
    return createAction.browse(namespace, api)(params);
  },
  read: (id) => {
    return createAction.read(namespace, api)(id);
  },
};
