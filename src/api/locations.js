import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const browse = (params) => {
  const { sort, keywordFilter, ...restParams } = params;
  const endpoints = {
    trending: 'locations/_browse/trending',
    popular: 'locations/_browse/ordered_by_degree',
  };

  const url = endpoints[sort] || 'locations/';
  return axios.get(url, {
    params: {
      q: keywordFilter,
      ...restParams,
    },
  });
};

const read = (id) => {
  return axios.get(`/locations/${id}`);
};

const edit = (node) => {
  return axios.patch(`/locations/${node.id}`, constructFormData(node));
};

const add = (node) => {
  return axios.post('/locations/', constructFormData(node));
};

const deleteItem = (id) => {
  return axios.delete(`/locations/${id}`);
};

export default {
  browse,
  read,
  edit,
  add,
  deleteItem,
};
