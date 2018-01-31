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

  return axios.get('/people.json', {
    params: {
      q: keywordFilter,
      usertype: usertypeFliter,
      disabled: disabledFilter,
      start: offset,
      limit,
    },
  });
}

export function readPerson(id) {
  return axios.get(`/people/${id}`);
}

export function followPerson(viewer, person) {
  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'follow',
  }));
}

export function unfollowPerson(viewer, person) {
  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unfollow',
  }));
}
