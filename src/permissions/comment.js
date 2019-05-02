const canAdd = (parent) => {
  const { commands } = parent;
  return commands ? commands.includes('comment') : false;
};

export default {
  canAdd,
//  canEdit,
//  canFollow,
};
