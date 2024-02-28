import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function browse(params) {
  const {
    filter,
    actor,
    start,
    limit,
    q,
  } = params;

  return axios.get(`/socialgraph/${actor.id}/${filter}/`, {
    params: {
      start,
      limit,
      q,
    },
  });
}

function follow(viewer, actor) {
  return axios.post(`/socialgraph/${actor.id}/followers/`);
}

function unfollow(viewer, actor) {
  return axios.delete(`/socialgraph/${actor.id}/followers/`);
}

function lead(viewer, actor) {
  return axios.post(`/socialgraph/${actor.id}/leaders/`, constructFormData({
    leader_id: viewer.id,
  }));
}

function unlead(viewer, actor) {
  return axios.delete(`/socialgraph/${actor.id}/leaders/`, constructFormData({
    leader_id: viewer.id,
  }));
}

function block(viewer, actor) {
  return axios.post(`/socialgraph/${actor.id}/blocks/`, constructFormData({
    blocked_id: viewer.id,
  }));
}

function unblock(viewer, actor) {
  return axios.delete(`socialgraph/${actor.id}/blocks/`, constructFormData({
    blocked_id: viewer.id,
  }));
}

export default {
  browse,
  follow,
  unfollow,
  lead,
  unlead,
  block,
  unblock,
};
