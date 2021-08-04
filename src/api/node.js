import axios from 'axios';
import utils from '../utils';

const read = (node) => {
  const namespace = utils.node.getNamespace(node);
  return axios.get(`/${namespace}/${node.id}.json`);
};

const deleteItem = (node) => {
  const namespace = utils.node.getNamespace(node);
  return axios.delete(`/${namespace}/${node.id}.json`);
};

export default {
  read,
  deleteItem,
};
