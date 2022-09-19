import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (params) => {
    const {
      node,
      start,
      limit,
      sort,
    } = params;
    return axios.get(`/${namespace}/${node.id}/comments.json?`, {
      params: {
        start,
        limit,
        sort,
      },
    });
  };
};

const read = (namespace) => {
  return (cid, node) => {
    return axios.get(`/${namespace}/${node.id}/${cid}.json`);
  };
};

const edit = (namespace) => {
  return (comment) => {
    const { id, parentId, body } = comment;
    return axios.post(`/${namespace}/${parentId}.json?cid=${id}`, constructFormData({
      action: 'editcomment',
      body,
    }));
  };
};

const add = (namespace) => {
  return (comment) => {
    const { body, parentId } = comment;
    return axios.post(`/${namespace}/${parentId}.json?`, constructFormData({
      action: 'addcomment',
      body,
    }));
  };
};

const deleteItem = (namespace) => {
  return (comment) => {
    const { id, parentId } = comment;
    return axios.post(`/${namespace}/${parentId}.json?cid=${id}`, constructFormData({
      action: 'deletecomment',
    }));
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    read: read(namespace),
    edit: edit(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
  };
};
