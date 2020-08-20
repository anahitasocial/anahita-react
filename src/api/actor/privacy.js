import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const read = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/privacy.json`);
  };
};

/*
action: setprivacy
access: followers
allowFollowRequest: 1
*/

const edit = (namespace) => {
  return (params) => {
    const {
      actor,
      access,
      allowFollowRequest,
    } = params;

    return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
      action: 'setprivacy',
      access,
      allowFollowRequest,
    }));
  };
};

export default (namespace) => {
  return {
    read: read(namespace),
    edit: edit(namespace),
  };
};
