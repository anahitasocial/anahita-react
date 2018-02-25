import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function followPerson(viewer, actor) {
  return axios.post(`/people/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'follow',
  }));
}

export function unfollowPerson(viewer, actor) {
  return axios.post(`/people/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unfollow',
  }));
}
