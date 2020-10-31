import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const getNamespace = (node) => {
  const { objectType } = node;
  return objectType.split('.')[1];
};

const browse = (tag) => {
  return (params) => {
    const { id } = tag;
    const namespace = getNamespace(tag);
    const { start, limit, sort } = params;

    return axios.get(`/${namespace}/${id}.json?`, {
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
    const namespace = getNamespace(taggable);
    const { id, objectType } = tag;

    return axios.post(`/${namespace}/${taggable.id}.json`, constructFormData({
      action: `add${objectType.split('.')[2]}`,
      location_id: id,
    }));
  };
};

const deleteItem = (tag) => {
  return (taggable) => {
    const namespace = getNamespace(taggable);
    const { id, objectType } = tag;

    return axios.post(`/${namespace}/${taggable.id}.json`, constructFormData({
      action: `delete${objectType.split('.')[2]}`,
      location_id: id,
    }));
  };
};

export default (tag) => {
  return {
    browse: browse(tag),
    add: add(tag),
    deleteItem: deleteItem(tag),
  };
};
