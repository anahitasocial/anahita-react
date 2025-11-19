const snakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => {
      return snakeToCamel(v);
    });
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => {
        return letter.toUpperCase();
      });
      return {
        ...result,
        [camelKey]: snakeToCamel(obj[key]),
      };
    }, {});
  }
  return obj;
};

export default {
  snakeToCamel,
};
