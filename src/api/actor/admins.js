import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/admins/`);
  };
};

const add = (namespaces) => {
  return (params) => {
    const { actor, admin } = params;
    return axios.post(`/${namespaces}/${actor.id}/admins/`, constructFormData({
      admin_id: admin.id,
    }));
  };
};

const deleteItem = (namespaces) => {
  return (params) => {
    const { admin, actor } = params;
    return axios.delete(`/${namespaces}/${actor.id}/admins/${admin.id}`);
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
  };
};
