import axios from 'axios';
import { constructFormData } from './utils';

const browse = (namespace) => {
  return (params) => {
    return axios.get(`/${namespace}.json`, {
      params: {
        start: params.offset,
        q: params.keywordFilter,
        ...params,
      },
    });
  };
};

const read = (namespace) => {
  return (id) => {
    return axios.get(`/${namespace}/${id}.json`);
  };
};

const edit = (namespace) => {
  return (node) => {
    return axios.post(`/${namespace}/${node.id}.json`, constructFormData(node));
  };
};

const add = (namespace) => {
  return (node) => {
    return axios.post(`/${namespace}.json`, constructFormData(node));
  };
};

const deleteItem = (namespace) => {
  return (node) => {
    return axios.delete(`/${namespace}/${node.id}.json`);
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    read: read(namespace),
    edit: edit(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
  };
};
