import createApi from './create';

const namespace = 'hashtags';

export default {
  browse: (params) => {
    return createApi.browse(namespace)(params);
  },
  read: (id) => {
    return createApi.read(namespace)(id);
  },
};
