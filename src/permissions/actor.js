import _ from 'lodash';
import utils from '../utils';

const isAdmin = (person) => {
  if (person.usertype) {
    return person.usertype === 'administrator' || person.usertype === 'super-administrator';
  }

  return false;
};

const isRegistered = (actor) => {
  return utils.node.isRegistered(actor);
};

const canAdd = (viewer) => {
  /*
  * @TODO we need a field in viewer to decide this one
  * right now, only the admins can create new actors
  */
  return isAdmin(viewer);
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

const canFollow = (actor, viewer) => {
  return actor.id !== viewer.id && !actor.isBlocked && !actor.isBlocked;
};

const canBlock = (actor, viewer) => {
  return utils.node.isPerson(actor) && actor.id !== viewer.id;
};

const canNotificationSettings = (actor) => {
  return !isRegistered(actor) &&
  _.intersection(
    actor.commands,
    ['notifications-settings'],
  ).length > 0;
};

const canViewCommands = (actor, exclude = []) => {
  if (utils.node.isPerson(actor) && !isRegistered(actor)) {
    return false;
  }

  return _.difference(
    actor.commands,
    exclude,
  ).length > 0;
};

export default {
  canAdd,
  canAdminister,
  canEdit,
  canDelete,
  canFollow,
  canBlock,
  canNotificationSettings,
  canViewCommands,
};
