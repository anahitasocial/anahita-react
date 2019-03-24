export const constructURLSearchParams = (urlParams) => {
  const params = new URLSearchParams();
  const keys = Object.keys(urlParams);

  keys.map((key) => {
    return params.append(key, urlParams[key]);
  });

  return params;
};

export default constructURLSearchParams;
