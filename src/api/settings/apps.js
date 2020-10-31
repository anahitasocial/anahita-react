import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (params) => {
  return axios.get('/settings/apps.json', { params });
};

const edit = (node) => {
  const { id, meta } = node;
  return axios.post(`/settings/apps/${id}.json`, constructFormData({
    ...meta,
  }));
};

export default {
  browse,
  edit,
};
