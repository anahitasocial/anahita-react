import React from 'react';

const OWNER_NAME_CHAR_LIMIT = 16;
const MEDIA_NODE_OBJECT_TYPES = [
  'com.articles.article',
  'com.documents.document',
  'com.notes.note',
  'com.photos.photo',
  'com.sets.set',
  'com.topics.topic',
  'com.todos.todo',
];

const MEDIA_NODE_BODY_HTML = [
  'com.articles.article',
  'com.topics.topic',
];

const getOwnerName = (node) => {
  const { owner: { name } } = node;
  if (name.length > OWNER_NAME_CHAR_LIMIT) {
    return `${name.substring(0, OWNER_NAME_CHAR_LIMIT)}...`;
  }
  return name;
};

const isCommentable = (medium) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(medium.objectType);
};

const isLikeable = (medium) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(medium.objectType);
};

const isSubscribable = (medium) => {
  return MEDIA_NODE_OBJECT_TYPES.includes(medium.objectType);
};

const isBodyHtml = (medium) => {
  return MEDIA_NODE_BODY_HTML.includes(medium.objectType);
};

const withRef = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} forwardedRef={ref} />;
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
  getOwnerName,
  isCommentable,
  isLikeable,
  isSubscribable,
  isBodyHtml,
  withRef,
  applyDrag,
};
