import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function followActor(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'follow',
  }));
}

export function unfollowActor(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unfollow',
  }));
}

export function blockActor(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'block',
  }));
}

export function unblockActor(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unblock',
  }));
}
