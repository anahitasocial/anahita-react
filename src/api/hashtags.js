import axios from 'axios';

const browse = (params) => {
  const { sort, keywordFilter, ...restParams } = params;
  const endpoints = {
    trending: 'hashtags/_browse/trending',
    popular: 'hashtags/_browse/ordered_by_degree',
  };

  const url = endpoints[sort] || 'hashtags/';
  return axios.get(url, {
    params: {
      q: keywordFilter,
      ...restParams,
    },
  });
};

export default {
  browse,
};
