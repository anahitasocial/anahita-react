import axios from 'axios';

const browse = (actor) => {
  return axios.get(`/socialgraph/${actor.id}/followrequests/`);
};

const add = (params) => {
  const { actor, followRequest } = params;
  return axios.post(`/socialgraph/${actor.id}/followrequests/${followRequest.id}`);
};

const deleteItem = (params) => {
  const { actor, followRequest } = params;
  return axios.delete(`/socialgraph/${actor.id}/followrequests/${followRequest.id}`);
};

export default {
  browse,
  add,
  deleteItem,
};
