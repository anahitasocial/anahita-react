import utils from '../utils';

const {
  isSuperAdmin,
} = utils.node;

const canBrowse = (viewer) => {
  return isSuperAdmin(viewer);
};

const canRead = (viewer) => {
  return isSuperAdmin(viewer);
};

const canEdit = (viewer) => {
  return isSuperAdmin(viewer);
};

const canAdd = (viewer) => {
  return isSuperAdmin(viewer);
};

const canDelete = (viewer) => {
  return isSuperAdmin(viewer);
};

export default {
  canBrowse,
  canRead,
  canEdit,
  canAdd,
  canDelete,
};
