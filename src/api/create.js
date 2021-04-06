import axios from 'axios';
import { singularize } from 'inflection';
import utils from '../utils';

const { constructFormData } = utils.api;

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
  return (node, owner = null) => {
    const path = (owner) ?
      `/${namespace}/@${owner.id}/${singularize(namespace)}.json` :
      `/${namespace}.json`;
    return axios.post(path, constructFormData(node));
  };
};

const deleteItem = (namespace) => {
  return (node) => {
    return axios.delete(`/${namespace}/${node.id}.json`);
  };
};

const download = (namespace) => {
  return (id) => {
    return axios.get(`/${namespace}/${id}.file`, { responseType: 'blob' });
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    read: read(namespace),
    edit: edit(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
    download: download(namespace),
  };
};
