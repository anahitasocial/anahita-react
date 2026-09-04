import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (params) => {
    return axios.get(`/${namespace}/`, {
      params: {
        q: params.keywordFilter,
        ...params,
      },
    });
  };
};

const read = (namespace) => {
  return (id) => {
    return axios.get(`/${namespace}/${id}`);
  };
};

const edit = (namespace) => {
  return (node) => {
    return axios.patch(`/${namespace}/${node.id}`, constructFormData(node));
  };
};

const editAccess = (namespace) => {
  return (node, owner = null) => {
    const path = (owner) ?
      `/${namespace}/${owner.id}/${node.id}/access` :
      `/${namespace}/${node.id}/access`;
    return axios.patch(path, constructFormData({
      access: node.access,
    }));
  };
};

const add = (namespace) => {
  return (node, owner = null) => {
    const path = (owner) ?
      `/${namespace}/${owner.id}/` :
      `/${namespace}/`;
    return axios.post(path, constructFormData(node));
  };
};

const deleteItem = (namespace) => {
  return (node) => {
    return axios.delete(`/${namespace}/${node.id}`);
  };
};

// Undo a deletion, within the 30-day grace period.
//
// Groups only in practice. A deleted person cannot sign in, so they never reach
// their own settings — they are offered restore at the login screen instead,
// which is the only place they can be. A group has no login, so its
// administrators restore it from the group's settings page, which stays
// reachable while the group is merely marked deleted.
const restore = (namespace) => {
  return (node) => {
    return axios.post(`/${namespace}/${node.id}/restore`);
  };
};

const download = (namespace) => {
  return (id) => {
    return axios.get(`/${namespace}/${id}/download`, { responseType: 'blob' });
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    read: read(namespace),
    edit: edit(namespace),
    editAccess: editAccess(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
    restore: restore(namespace),
    download: download(namespace),
  };
};
