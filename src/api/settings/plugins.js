import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (params) => {
  return axios.get('/settings/plugins.json', { params });
};

const edit = (node) => {
  const { id, enabled, meta } = node;
  return axios.post(`/settings/plugins/${id}.json`, constructFormData({
    ...meta,
    enabled: enabled ? 1 : 0,
  }));
};

export default {
  browse,
  edit,
};
