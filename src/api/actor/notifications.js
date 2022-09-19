import axios from 'axios';

const read = (actor) => {
  return axios.get(`/notifications/settings?oid=${actor.id}`);
};

const edit = (params) => {
  const { actor, sendEmail } = params;
  return axios.post(`/notifications/settings?oid=${actor.id}`, {
    email: sendEmail ? 1 : 0,
  });
};

const editType = (namespace) => {
  return (actor) => {
    return axios.post(`/${namespace}/${actor.id}.json`, {
      action: 'togglesubscription',
    });
  };
};

export default (namespace) => {
  return {
    read,
    edit,
    editType: editType(namespace),
  };
};
