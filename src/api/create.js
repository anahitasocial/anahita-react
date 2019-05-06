/*
* DO NOT USE this module yet. It is an experiment.
*/

import axios from 'axios';
import { constructURLSearchParams } from './utils';

const createBrowseApi = (namespace) => {
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

const createReadApi = (namespace) => {
  return (id) => {
    return axios.get(`/${namespace}/${id}.json`);
  };
};

const createEditApi = (namespace) => {
  return (node) => {
    return axios.put(`/${namespace}/${node.id}.json`, constructURLSearchParams(node));
  };
};

const createAddApi = (namespace) => {
  return (node) => {
    return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams(node));
  };
};

const createDeleteApi = (namespace) => {
  return (node) => {
    return axios.delete(`/${namespace}/${node.id}.json`);
  };
};

export default {
  createBrowseApi,
  createReadApi,
  createEditApi,
  createAddApi,
  createDeleteApi,
};
