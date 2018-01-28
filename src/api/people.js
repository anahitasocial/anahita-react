import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function browsePeople(params) {
  const {
    keywordFilter,
    usertypeFliter,
    disabledFilter,
    offset,
    limit,
  } = params;

  return axios.get('/people.json', constructURLSearchParams({
    q: keywordFilter,
    usertype: usertypeFliter,
    disabled: disabledFilter,
    start: offset,
    limit,
  }));
}

export function readPerson(id) {
  return axios.get(`/people/${id}`);
}
