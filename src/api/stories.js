import axios from 'axios';

function browse(params) {
  return axios.get('/stories.json', {
    params: {
      start: params.offset,
      oid: params.ownerId,
      ...params,
    },
  });
}

function read(id) {
  return axios.get(`/stories/${id}.json`);
}

function deleteItem(story) {
  return axios.delete(`/stories/${story.id}.json`);
}

export default {
  browse,
  read,
  deleteItem,
};
