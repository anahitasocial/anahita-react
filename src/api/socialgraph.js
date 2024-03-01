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

function follow(actor) {
  return axios.post(`/socialgraph/${actor.id}/followers/`);
}

function unfollow(actor) {
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

function block(actor) {
  return axios.post(`/socialgraph/${actor.id}/blocks/`);
}

function unblock(actor) {
  return axios.delete(`socialgraph/${actor.id}/blocks/`);
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
