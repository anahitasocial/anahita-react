import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const getNamespace = (node) => {
  const { objectType } = node;
  return objectType.split('.')[1];
};

const getNodeType = (node) => {
  const { objectType } = node;
  return objectType.split('.')[2];
};

const browse = (node) => {
  return (params) => {
    const { objectType } = params;
    return axios.get(`/${objectType.split('.')[1]}.json?`, {
      params: {
        taggable_id: node.id,
        ...params,
      },
    });
  };
};

const add = (node) => {
  return (tag) => {
    const namespace = getNamespace(node);
    const tagType = getNodeType(tag);
    return axios.post(`/${namespace}/${node.id}.json?`, constructFormData({
      action: `add${tagType}`,
      [`${tagType}_id`]: tag.id,
    }));
  };
};

const deleteItem = (node) => {
  return (tag) => {
    const namespace = getNamespace(node);
    const tagType = getNodeType(tag);
    return axios.post(`/${namespace}/${node.id}.json`, constructFormData({
      action: `delete${tagType}`,
      [`${tagType}_id`]: tag.id,
    }));
  };
};

export default (node) => {
  return {
    browse: browse(node),
    add: add(node),
    deleteItem: deleteItem(node),
  };
};
