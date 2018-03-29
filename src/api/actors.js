import axios from 'axios';
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

export function editActor(actor, namespace) {
  const {
    name,
    body,
  } = actor;
  return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
    name,
    body,
  }));
}
