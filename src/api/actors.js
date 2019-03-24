import axios from 'axios';
import { singularize } from 'inflected';
import { constructURLSearchParams } from './utils';

const browse = (params, namespace) => {
  return axios.get(`/${namespace}.json`, {
    params: {
      start: params.offset,
      q: params.keywordFilter,
      ...params,
    },
  });
};

const read = (id, namespace) => {
  return axios.get(`/${namespace}/${id}.json`);
};

const edit = (actor) => {
  const {
    name,
    body,
  } = actor;
  const namespace = actor.objectType.split('.')[1];
  return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
    name,
    body,
  }));
};

const add = (params, namespace) => {
  const {
    name,
    body,
    enabled,
    access,
  } = params;
  return axios.post(`/${namespace}/${singularize(namespace)}.json`, constructURLSearchParams({
    name,
    body,
    enabled,
    access,
  }));
};

const deleteItem = (actor) => {
  const namespace = actor.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${actor.id}.json`);
};

export {
  browse,
  read,
  edit,
  add,
  deleteItem,
};
