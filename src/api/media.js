import axios from 'axios';
import { singularize } from 'inflected';
import { constructURLSearchParams } from './utils';

export function browseMedia(params, namespace) {
  return axios.get(`/${namespace}.json`, {
    params: {
      start: params.offset,
      oid: params.ownerId,
      ...params,
    },
  });
}

export function readMedium(id, namespace) {
  return axios.get(`/${namespace}/${id}.json`);
}

export function editMedium(medium) {
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

export function addMedium(params, namespace) {
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

export function deleteMedium(medium) {
  const namespace = medium.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${medium.id}.json`);
}
