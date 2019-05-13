/* global FormData, File */
import axios from 'axios';

const edit = (node, file) => {
  const { id, objectType } = node;
  const namespace = objectType.split('.')[1];
  const formData = new FormData();

  if (!file) {
    const newFile = new File([], '');
    formData.append('cover', newFile);
  } else {
    formData.append('cover', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/${namespace}/${id}.json?edit=cover`, formData, config);
};

export default { edit };
