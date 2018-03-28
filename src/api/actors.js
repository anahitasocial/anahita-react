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
  let params = {};
  if (namespace === 'people') {
    params = {
      givenName: actor.givenName,
      familyName: actor.familyName,
      body: actor.body,
      gender: actor.gender,
    };
  } else {
    params = {
      name: actor.name,
      body: actor.body,
    };
  }

  console.log(params);

  return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams(params));
}
