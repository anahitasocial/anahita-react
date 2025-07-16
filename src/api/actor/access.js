/* eslint camelcase: "off" */
import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const read = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/access`);
  };
};

const edit = (namespace) => {
  return (node) => {
    return axios.patch(`/${namespace}/${node.id}/access`, constructFormData({
      access: node.access,
      allowFollowRequest: node.allowFollowRequest,
      whoCanAddFollowers: node.whoCanAddFollowers,
    }));
  };
};

export default (namespace) => {
  return {
    read: read(namespace),
    edit: edit(namespace),
  };
};
