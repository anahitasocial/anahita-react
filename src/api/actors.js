import axios from 'axios';
import { singularize } from 'inflected';
import { constructURLSearchParams } from './utils';

function browse(params, namespace) {
  return axios.get(`/${namespace}.json`, {
    params: {
      start: params.offset,
      q: params.keywordFilter,
      ...params,
    },
  });
}

function read(id, namespace) {
  return axios.get(`/${namespace}/${id}.json`);
}

function edit(actor) {
  const {
    name,
    body,
  } = actor;
  const namespace = actor.objectType.split('.')[1];
  return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
    name,
    body,
  }));
}

function add(params, namespace) {
  const {
    name,
    body,
    enabled,
    access,
  } = params;
  return axios.post(`/${namespace}/${singularize(namespace)}.json`, constructURLSearchParams({
    name,
    body,
    enabled,
    access,
  }));
}

function deleteActor(actor) {
  const namespace = actor.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${actor.id}.json`);
}

// @todo the editAvatar and editCover code is wet. Make it DRY!

function editAvatar(actor, file) {
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
}

function editCover(actor, file) {
  const namespace = actor.objectType.split('.')[1];
  const { id } = actor;
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
}

export {
  browse,
  read,
  edit,
  add,
  deleteActor,
  editAvatar,
  editCover,
};
