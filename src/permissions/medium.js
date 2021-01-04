import nodePermissions from './node';

const canEdit = (viewer, medium) => {
  return nodePermissions.canEdit(viewer, medium);
};

const canAdd = (viewer, owner) => {
  return nodePermissions.canAdd(viewer, owner);
};

const canDelete = (viewer, medium) => {
  return nodePermissions.canDelete(viewer, medium);
};

export default {
  canAdd,
  canEdit,
  canDelete,
};
