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

export default {
  constructURLSearchParams,
  constructFormData,
};
