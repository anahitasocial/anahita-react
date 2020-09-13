/* eslint camelcase: "off" */
import axios from 'axios';
import { constructFormData } from '../utils';

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

    let privacy_name = ['access', 'leadable:add'];

    if (namespace === 'people') {
      privacy_name = ['access'];
      delete privacy['leadable:add'];
    }

    return axios.post(`/${namespace}/${actor.id}/privacy.json`, constructFormData({
      action: 'setprivacy',
      privacy_name,
      ...privacy,
    }));
  };
};

export default (namespace) => {
  return {
    read: read(namespace),
    edit: edit(namespace),
  };
};
