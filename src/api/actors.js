import axios from 'axios';

export function browseActors(params, namespace) {
  const {
    disabledFilter,
    offset,
    limit,
  } = params;

  return axios.get(`/${namespace}.json`, {
    params: {
      disabled: disabledFilter,
      start: offset,
      limit,
    },
  });
}

export function readActor(id, namespace) {
  return axios.get(`/${namespace}/${id}.json`);
}
