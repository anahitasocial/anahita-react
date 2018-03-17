export default function (entity) {
  return (action) => {
    return {
      REQUEST: `${entity.toUpperCase()}_${action.toUpperCase()}_REQUEST`,
      SUCCESS: `${entity.toUpperCase()}_${action.toUpperCase()}_SUCCESS`,
      FAILURE: `${entity.toUpperCase()}_${action.toUpperCase()}_FAILURE`,
    };
  };
}
