/* global FormData, File */
import axios from 'axios';

const edit = (actor, file) => {
  const namespace = actor.objectType.split('.')[1];
  const { id } = actor;
  const formData = new FormData();

  if (!file) {
    const newFile = new File([], '');
    formData.append('portrait', newFile);
  } else {
    formData.append('portrait', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/${namespace}/${id}.json?edit=avatar`, formData, config);
};

export {
  edit,
};
