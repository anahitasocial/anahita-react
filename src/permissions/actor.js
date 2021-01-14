import _ from 'lodash';

import utils from '../utils';
import { Person as PERSON } from '../constants';

const {
  ADMIN,
  SUPER_ADMIN,
  REGISTERED,
} = PERSON.FIELDS.TYPE;

const isAdmin = (actor) => {
  return [SUPER_ADMIN, ADMIN].includes(actor.usertype);
};

const isRegistered = (actor) => {
  return [SUPER_ADMIN, ADMIN, REGISTERED].includes(actor.usertype);
};

const canAdd = (viewer) => {
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

const canFollow = (actor) => {
  return !actor.isBlocked &&
  _.intersection(
    actor.commands,
    ['follow', 'unfollow'],
  ).length > 0;
};

const canBlock = (actor) => {
  return !isAdmin(actor) &&
  _.intersection(
    actor.commands,
    ['block', 'unblock'],
  ).length > 0;
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
