import axios from 'axios';
import { singularize } from 'inflected';
import { constructURLSearchParams } from './utils';

function browse(params, namespace) {
  return axios.get(`/${namespace}.json`, {
    params: {
      start: params.offset,
      oid: params.ownerId,
      ...params,
    },
  });
}

function read(id, namespace) {
  return axios.get(`/${namespace}/${id}.json`);
}

function edit(medium) {
  const {
    title,
    description,
  } = medium;
  const namespace = medium.objectType.split('.')[1];
  return axios.post(`/${namespace}/${medium.id}.json`, constructURLSearchParams({
    title,
    description,
  }));
}

function add(params, namespace) {
  const {
    title,
    description,
    enabled,
    access,
  } = params;

  return axios.post(`/${namespace}/${singularize(namespace)}.json`, constructURLSearchParams({
    title,
    description,
    enabled,
    access,
  }));
}

function deleteItem(medium) {
  const namespace = medium.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${medium.id}.json`);
}

export default {
  browse,
  read,
  edit,
  add,
  deleteItem,
};
