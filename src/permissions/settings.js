import utils from '../utils';

const {
  isSuperAdmin,
} = utils.node;

const canEdit = (viewer) => {
  return isSuperAdmin(viewer);
};

export default {
  canEdit,
};
