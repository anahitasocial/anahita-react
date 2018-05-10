import axios from 'axios';
import { singularize } from 'inflected';
import { constructURLSearchParams } from './utils';

export function browseActors(params, namespace) {
  return axios.get(`/${namespace}.json`, {
    params: {
      start: params.offset,
      q: params.keywordFilter,
      ...params,
    },
  });
}

export function readActor(id, namespace) {
  return axios.get(`/${namespace}/${id}.json`);
}

export function editActor(actor) {
  const {
    name,
    body,
  } = actor;
  const namespace = actor.objectType.split('.')[1];
  return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
    name,
    body,
  }));
}

export function addActor(params, namespace) {
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
}

export function deleteActor(actor) {
  const namespace = actor.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${actor.id}.json`);
}

export function editAvatar(actor, file) {
  const namespace = actor.objectType.split('.')[1];
  const { id } = actor;
  const formData = new FormData();

  if (!file) {
    const newFile = new File([], '');
    formData.append('portrait', newFile);
  } else {
    formData.append('portrait', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/${namespace}/${id}.json?edit=avatar`, formData, config);
}
