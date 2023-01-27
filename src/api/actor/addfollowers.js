import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (params) => {
    const { actor, limit, q } = params;
    return axios.get(`/${namespace}/${actor.id}/graph/leadables.json`, {
      params: {
        start: params.offset,
        limit,
        q,
      },
    });
  };
};

const add = (namespaces) => {
  return (params) => {
    const { actor, follower } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, constructFormData({
      action: 'addfollower',
      actor: follower.id,
    }));
  };
};

const deleteItem = (namespaces) => {
  return (params) => {
    const { follower, actor } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, constructFormData({
      action: 'removefollower',
      actor: follower.id,
    }));
  };
};

const block = (namespaces) => {
  return (params) => {
    const { follower, actor } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, constructFormData({
      action: 'blockfollower',
      actor: follower.id,
    }));
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
    block,
  };
};
