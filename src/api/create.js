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
      allowFollowRequest: node.allowFollowRequest,
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
    download: download(namespace),
  };
};
