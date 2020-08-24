import { Person as PERSON } from '../constants';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;

const canAdd = (viewer) => {
  return [SUPER_ADMIN, ADMIN].includes(viewer.usertype);
};

const canEdit = (actor) => {
  const { authorized } = actor;
  return Boolean(authorized && authorized.edit);
};

const canDelete = (actor) => {
  const { authorized } = actor;
  return Boolean(authorized && authorized.delete);
};

const canAdminister = (actor) => {
  const { authorized } = actor;
  return Boolean(authorized && authorized.administration);
};

const canFollow = (isAuthenticated, viewer, actor) => {
  return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
};

export default {
  canAdd,
  canAdminister,
  canEdit,
  canDelete,
  canFollow,
};
