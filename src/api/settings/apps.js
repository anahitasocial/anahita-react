import axios from 'axios';
import qs from 'qs';

const browse = (params) => {
  return axios.get('/settings/apps.json', { params });
};

const edit = (node) => {
  const { id, meta } = node;
  return axios.post(`/settings/apps/${id}.json`, qs.stringify({
    ...meta,
  }));
};

export default {
  browse,
  edit,
};
