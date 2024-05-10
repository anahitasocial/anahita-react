import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const getNamespace = (node) => {
  const { objectType } = node;
  return objectType.split('.')[1];
};

const browse = (tag) => {
  return (params) => {
    const namespace = getNamespace(tag);
    const { start, limit, sort } = params;

    return axios.get(`/${namespace}/${tag.id}/taggables?`, {
      params: {
        start,
        limit,
        sort,
      },
    });
  };
};

const add = (tag) => {
  return (taggable) => {
    const namespace = getNamespace(tag);
    return axios.post(`/${namespace}/${tag.id}/taggables/`, constructFormData({
      taggable_id: taggable.id,
    }));
  };
};

const deleteItem = (tag) => {
  return (taggable) => {
    const namespace = getNamespace(tag);
    return axios.delete(`/${namespace}/${tag.id}/taggables/${taggable.id}`);
  };
};

export default (tag) => {
  return {
    browse: browse(tag),
    add: add(tag),
    deleteItem: deleteItem(tag),
  };
};
