import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const browse = (params) => {
  return axios.get('/settings/apps.json', { params });
};

const edit = (node) => {
  const { id, meta } = node;
  return axios.post(`/settings/apps/${id}.json`, constructURLSearchParams({
    ...meta,
  }));
};

export default {
  browse,
  edit,
};
