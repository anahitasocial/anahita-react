export default (node) => {
  return (action) => {
    return {
      REQUEST: `${node.toUpperCase()}_${action.toUpperCase()}_REQUEST`,
      SUCCESS: `${node.toUpperCase()}_${action.toUpperCase()}_SUCCESS`,
      FAILURE: `${node.toUpperCase()}_${action.toUpperCase()}_FAILURE`,
    };
  };
};
