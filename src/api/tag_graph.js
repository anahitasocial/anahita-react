import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const getNamespace = (node) => {
  const { objectType } = node;

  return objectType.split('.')[1];
};

const browse = (node) => {
  return (params) => {
    const { objectType, ...rest } = params;
    return axios.get(`/${objectType.split('.')[1]}/`, {
      params: {
        taggable_id: node.id,
        ...rest,
      },
    });
  };
};

const add = (node) => {
  return (tag) => {
    const namespace = getNamespace(tag);
    return axios.post(`/${namespace}/${tag.id}/taggables/`, constructFormData({
      taggable_id: node.id,
    }));
  };
};

const deleteItem = (node) => {
  return (tag) => {
    const namespace = getNamespace(tag);
    return axios.delete(`/${namespace}/${tag.id}/taggables/${node.id}`);
  };
};

export default (node) => {
  return {
    browse: browse(node),
    add: add(node),
    deleteItem: deleteItem(node),
  };
};
