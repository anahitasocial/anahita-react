import _ from 'lodash';

const getFormControllerKeys = (formControllers) => {
  const keys = [];
  formControllers.forEach((fc) => {
    return keys.push(fc.name);
  });
  return keys;
};

const getMetaEntity = (formControllers) => {
  const newEntity = {};

  formControllers.forEach((c) => {
    const { name, value } = c;
    newEntity[name] = value;
  });

  return newEntity;
};

const getMetaURLParams = (meta) => {
  const newMeta = {};

  _.forEach(meta, (value, key) => {
    newMeta[`meta[${key}]`] = value;
  });

  return newMeta;
};

export default {
  getFormControllerKeys,
  getMetaEntity,
  getMetaURLParams,
};
