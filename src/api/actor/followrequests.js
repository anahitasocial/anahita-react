import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/followrequests.json`);
  };
};

const add = (namespaces) => {
  return (params) => {
    const { actor, followRequest } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, constructFormData({
      action: 'confirmRequest',
      requester: followRequest.id,
    }));
  };
};

const deleteItem = (namespaces) => {
  return (params) => {
    const { actor, followRequest } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, constructFormData({
      action: 'ignoreRequest',
      requester: followRequest.id,
    }));
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
  };
};
