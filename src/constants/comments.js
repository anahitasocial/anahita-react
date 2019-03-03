import async from './async';

export default (namespace) => {
  const comments = async(`${namespace}_comments`);
  return {
    BROWSE: comments('browse'),
    READ: comments('read'),
    EDIT: comments('edit'),
    ADD: comments('add'),
    DELETE: comments('delete'),
  };
};
