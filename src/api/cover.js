import axios from 'axios';

const add = (node, file) => {
  const { id } = node;
  const formData = new FormData();

  // Only append the file if it exists
  if (file) {
    formData.append('cover', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/covers/${id}/`, formData, config);
};

const deleteItem = (node) => {
  const { id } = node;
  return axios.delete(`/covers/${id}/`);
};

export default {
  add,
  deleteItem,
};
