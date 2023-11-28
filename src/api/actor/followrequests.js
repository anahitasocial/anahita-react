import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (actor) => {
  return axios.get(`/socialgraph/${actor.id}/followrequests/`);
};

const add = (params) => {
  const { actor, followRequest } = params;
  return axios.post(`/socialgraph/${actor.id}/followrequests/`, constructFormData({
    action: 'confirmRequest',
    requester: followRequest.id,
  }));
};

const deleteItem = (params) => {
  const { actor, followRequest } = params;
  return axios.post(`/socialgraph/${actor.id}/followrequests/`, constructFormData({
    action: 'ignoreRequest',
    requester: followRequest.id,
  }));
};

export default {
  browse,
  add,
  deleteItem,
};
