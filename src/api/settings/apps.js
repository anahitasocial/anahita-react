import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const browse = (params) => {
  return axios.get('/settings/apps.json', { params });
};

const read = (node) => {
  return axios.get(`/settings/apps/${node.id}.json`);
};

const edit = (node) => {
  return axios.post(`/settings/apps/${node.id}.json`, constructURLSearchParams(node));
};

export default {
  browse,
  read,
  edit,
};
