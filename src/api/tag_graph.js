import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;
const { getNamespace } = utils.node;

const browse = (nodeA) => {
  return (params) => {
    const { objectType, ...rest } = params;
    return axios.get(`/${objectType.split('.')[1]}/`, {
      params: {
        source_id: nodeA.id,
        ...rest,
      },
    });
  };
};

const add = (nodeA) => {
  return (nodeB) => {
    const namespace = getNamespace(nodeB);
    return axios.post(`/${namespace}/${nodeB.id}/inbounds/`, constructFormData({
      source_id: nodeA.id,
    }));
  };
};

const deleteItem = (nodeA) => {
  return (nodeB) => {
    const namespace = getNamespace(nodeB);
    return axios.delete(`/${namespace}/${nodeB.id}/inbounds/${nodeA.id}`);
  };
};

export default (node) => {
  return {
    browse: browse(node),
    add: add(node),
    deleteItem: deleteItem(node),
  };
};
