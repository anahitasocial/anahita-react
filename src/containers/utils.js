import React from 'react';

const OWNER_NAME_CHAR_LIMIT = 16;
const MEDIA_NODE_OBJECT_TYPES = [
  'com.articles.article',
  'com.notes.note',
  'com.photos.photo',
  'com.sets.set',
  'com.topics.topic',
  'com.todos.todo',
];

const getOwnerName = (node) => {
  const { owner: { name } } = node;
  if (name.length > OWNER_NAME_CHAR_LIMIT) {
    return `${name.substring(0, OWNER_NAME_CHAR_LIMIT)}...`;
  }
  return name;
};

const getColumnWidthPercentage = (width) => {
  let columnWidth = '100%';

  if (width === 'md') {
    columnWidth = '50%';
  } else if (width === 'lg') {
    columnWidth = '33.33%';
  } else if (width === 'xl') {
    columnWidth = '25%';
  }

  return columnWidth;
};

const isCommentable = (node) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(node.objectType);
};

const isLikeable = (node) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(node.objectType);
};

const isSubscribable = (node) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(node.objectType);
};

const withRef = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} forwardedRef={ref} />;
  });
};

export default {
  getOwnerName,
  getColumnWidthPercentage,
  isCommentable,
  isLikeable,
  isSubscribable,
  withRef,
};
