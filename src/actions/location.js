import createAction from './create';
import { locations as api } from '../api';

const namespace = 'locations';

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
