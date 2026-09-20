import axios from 'axios';

const browse = (params) => {
  const { viewer, limit, q } = params;
  return axios.get(`/socialgraph/${viewer.id}/mutuals`, {
    params: {
      start: params.offset,
      limit,
      q,
    },
  });
};

const add = (params) => {
  const { actor, follower } = params;
  return axios.post(`/socialgraph/${actor.id}/followers/${follower.id}`);
};

const deleteItem = (params) => {
  const { follower, actor } = params;
  return axios.delete(`/socialgraph/${actor.id}/followers/${follower.id}`);
};

const block = (params) => {
  const { follower, actor } = params;
  return axios.post(`/socialgraph/${actor.id}/blocks/${follower.id}`);
};

export default {
  browse,
  add,
  deleteItem,
  block,
};
