/* eslint camelcase: "off" */
import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const edit = (namespace) => {
  return (params) => {
    const {
      medium,
      privacy,
    } = params;

    const data = {
      action: 'setprivacy',
      'privacy_name[0]': 'access',
      access: privacy.access,
    };

    return axios.post(`/${namespace}/${medium.id}.json`, constructFormData(data));
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
