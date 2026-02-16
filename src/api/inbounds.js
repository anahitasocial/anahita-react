import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;
const { getNamespace } = utils.node;

const browse = (node) => {
  return (params) => {
    const namespace = getNamespace(node);
    const { start, limit, sort } = params;

    return axios.get(`/${namespace}/${node.id}/inbounds?`, {
      params: {
        start,
        limit,
        sort,
      },
    });
  };
};

const add = (nodeB) => {
  return (nodeA) => {
    const namespace = getNamespace(nodeA);
    return axios.post(`/${namespace}/${nodeA.id}/inbounds`, constructFormData({
      source_id: nodeB.id,
    }));
  };
};

const deleteItem = (nodeB) => {
  return (nodeA) => {
    const namespace = getNamespace(nodeA);
    return axios.delete(`/${namespace}/${nodeA.id}/inbounds/${nodeB.id}`);
  };
};

export default (node) => {
  return {
    browse: browse(node),
    add: add(node),
    deleteItem: deleteItem(node),
  };
};
