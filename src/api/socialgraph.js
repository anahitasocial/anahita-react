import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function browse(params) {
  const {
    filter,
    actor,
    start,
    q,
  } = params;
  const component = utils.node.getNamespace(actor);
  return axios.get(`/${component}/${actor.id}/graph/${filter}.json`, {
    params: {
      start,
      q,
    },
  });
}

function follow(viewer, actor) {
  const component = utils.node.getNamespace(actor);
  return axios.post(`/${component}/${actor.id}.json`, constructFormData({
    actor: viewer.id,
    action: 'follow',
  }));
}

function unfollow(viewer, actor) {
  const component = utils.node.getNamespace(actor);
  return axios.post(`/${component}/${actor.id}.json`, constructFormData({
    actor: viewer.id,
    action: 'unfollow',
  }));
}

function block(viewer, actor) {
  const component = utils.node.getNamespace(actor);
  return axios.post(`/${component}/${actor.id}.json`, constructFormData({
    actor: viewer.id,
    action: 'block',
  }));
}

function unblock(viewer, actor) {
  const component = utils.node.getNamespace(actor);
  return axios.post(`/${component}/${actor.id}.json`, constructFormData({
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
