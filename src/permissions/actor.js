import _ from 'lodash';
import utils from '../utils';
import meetsRoleLevel from './roleLevel';

const {
  isRegistered,
} = utils.node;

// Whether the viewer may create an actor — a group, today.
//
// Mirrors anahita-libs ActorsPermissions.CanAdd and group-service's
// Config.MayCreateGroup. Who may create one is a SERVER SETTING, GROUPS_FROM,
// naming a minimum role of registered, administrators or super-administrators,
// so it cannot be derived from the viewer alone. It arrives through NodeInfo
// as metadata.groupsFrom.
//
// This used to be a bare isAdmin with a @TODO saying a field was needed to
// decide it properly. The field is groupsFrom, and it is compared by rank with
// no administrator shortcut above it — one would make `super-administrators` a
// level that does nothing.
//
// Absent until NodeInfo answers, which ranks above every role, so nothing
// offers to create a group before the server has said who may.
const canAdd = (viewer, { groupsFrom = '' } = {}) => {
  return meetsRoleLevel(viewer, groupsFrom);
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
