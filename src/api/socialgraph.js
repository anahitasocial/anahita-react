import axios from 'axios';
import { constructURLSearchParams } from './utils';

function browse(params) {
  const {
    filter,
    actor,
    start,
    q,
  } = params;
  const component = actor.objectType.split('.')[1];

  return axios.get(`/${component}/${actor.id}/graph/${filter}.json`, {
    params: {
      start,
      q,
    },
  });
}

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
  browse,
  follow,
  unfollow,
  block,
  unblock,
};
