/* eslint camelcase: "off" */
import axios from 'axios';

const edit = (namespace) => {
  return (id, features) => {
    return axios.patch(`/${namespace}/${id}/features`, {
      id,
      features,
    });
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
