/* eslint camelcase: "off" */
import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const read = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/privacy.json`);
  };
};

const edit = (namespace) => {
  return (params) => {
    const {
      actor,
      privacy,
    } = params;

    const data = namespace === 'people' ? {
      action: 'setprivacy',
      'privacy_name[0]': 'access',
      access: privacy.access,
      allowFollowRequest: privacy.allowFollowRequest,
    } : {
      action: 'setprivacy',
      'privacy_name[0]': 'access',
      'privacy_name[1]': 'leadable:add',
      access: privacy.access,
      'leadable:add': privacy['leadable:add'],
      allowFollowRequest: privacy.allowFollowRequest,
    };

    return axios.post(`/${namespace}/${actor.id}/privacy.json`, constructFormData(data));
  };
};

export default (namespace) => {
  return {
    read: read(namespace),
    edit: edit(namespace),
  };
};
