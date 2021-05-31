import _ from 'lodash';
import { Person as PERSON } from '../constants';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;

const canEdit = (viewer, node) => {
  if (node.authorized && node.authorized.edit) {
    return true;
  }

  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
    return true;
  }

  if (node.administrators) {
    const admins = node.administrators || [];
    if (_.find(admins, (admin) => {
      return admin.id === viewer.id;
    })) {
      return true;
    }
  }

  if (node.owner && node.owner.id === viewer.id) {
    return true;
  }

  if (node.author && node.author.id === viewer.id) {
    return true;
  }

  return false;
};

const canAdd = (viewer, owner = null) => {
  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
    return true;
  }

  if (owner && viewer.id === owner.id) {
    return true;
  }

  return false;
};

const canDelete = (viewer, node) => {
  if (node.authorized && node.authorized.delete) {
    return true;
  }

  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
    return true;
  }

  if (node.owner && node.owner.id === viewer.id) {
    return true;
  }

  return false;
};

const canAdminister = (viewer) => {
  return [SUPER_ADMIN, ADMIN].includes(viewer.usertype);
};

export default {
  canAdd,
  canAdminister,
  canEdit,
  canDelete,
};
