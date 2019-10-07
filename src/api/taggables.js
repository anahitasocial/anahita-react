import axios from 'axios';

const browse = (params) => {
  const {
    tag: {
      id,
      objectType,
    },
  } = params;

  const namespace = objectType.split('.')[1];
  const { start, limit, sort } = params;

  return axios.get(`/${namespace}/${id}.json?`, {
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
