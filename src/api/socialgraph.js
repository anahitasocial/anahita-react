import axios from 'axios';
import { constructURLSearchParams } from './utils';

function follow(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'follow',
  }));
}

function unfollow(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unfollow',
  }));
}

function block(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'block',
  }));
}

function unblock(viewer, actor) {
  const component = actor.objectType.split('.')[1];
  return axios.post(`/${component}/${actor.id}.json`, constructURLSearchParams({
    actor: viewer.id,
    action: 'unblock',
  }));
}

export default {
  follow,
  unfollow,
  block,
  unblock,
};
