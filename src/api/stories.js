import axios from 'axios';

export function browseStories(params) {
  return axios.get('/stories.json', {
    params: {
      start: params.offset,
      oid: params.ownerId,
      ...params,
    },
  });
}

export function readStory(id) {
  return axios.get(`/stories/${id}.json`);
}

export function deleteStory(story) {
  return axios.delete(`/stories/${story.id}.json`);
}
