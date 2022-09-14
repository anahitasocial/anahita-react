import axios from 'axios';

const edit = (namespace) => {
  return (actor) => {
    return axios.post(`/${namespace}/${actor.id}.json`, {
      action: 'togglesubscription',
    });
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
