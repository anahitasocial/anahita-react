import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const browse = (params) => {
  return axios.get('/settings/plugins.json', { params });
};

const read = (node) => {
  return axios.get(`/settings/plugins/${node.id}.json`);
};

const edit = (node) => {
  return axios.post(`/settings/plugins/${node.id}.json`, constructURLSearchParams({
    ...node,
    enabled: node.enabled ? 1 : 0,
  }));
};

export default {
  browse,
  read,
  edit,
};
