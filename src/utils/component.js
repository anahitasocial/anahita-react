import React from 'react';

const withRef = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} forwardedref={ref} />;
  });
};

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) {
    return arr;
  }

  const result = [...arr];
  const itemToAdd = removedIndex === null ? payload.id : result.splice(removedIndex, 1)[0];

  result.splice(addedIndex, 0, itemToAdd);

  return result;
};

export default {
  withRef,
  applyDrag,
};
