/* eslint-disable no-undef */
const constructURLSearchParams = (urlParams) => {
  const params = new URLSearchParams();
  const keys = Object.keys(urlParams);

  keys.map((key) => {
    return params.append(key, urlParams[key]);
  });

  return params;
};

const constructFormData = (params) => {
  const formData = new FormData();
  const keys = Object.keys(params);

  keys.map((key) => {
    return formData.append(key, params[key]);
  });

  return formData;
};

const camelCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => {
      return camelCaseKeys(v);
    });
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = _.camelCase(key);
      return {
        ...result,
        [camelKey]: camelCaseKeys(obj[key]),
      };
    }, {});
  }
  return obj;
};

const snakeCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => {
      return snakeCaseKeys(v);
    });
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = _.snakeCase(key);
      return {
        ...result,
        [snakeKey]: snakeCaseKeys(obj[key]),
      };
    }, {});
  }
  return obj;
};

export default {
  constructURLSearchParams,
  constructFormData,
  camelCaseKeys,
  snakeCaseKeys,
};
