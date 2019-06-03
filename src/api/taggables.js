import axios from 'axios';

const browse = (params) => {
  const {
    tag: {
      id,
      name,
      objectType,
    },
  } = params;

  const namespace = objectType.split('.')[1];
  const alias = namespace === 'hashtags' ? name.toLowerCase() : `${id}-${name.toLowerCase()}`;
  const { start, limit, sort } = params;

  return axios.get(`/${namespace}/${alias}.json?`, {
    params: {
      start,
      limit,
      sort,
    },
  });
};

export default {
  browse,
};
