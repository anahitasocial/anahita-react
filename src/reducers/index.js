import { combineReducers } from 'redux';

import app from './app';
import avatar from './avatar';
import cover from './cover';
import commentsInline from './commentsInline';
import locations from './locations';
import locationsGraph from './locationsGraph';
import hashtags from './hashtags';
import notifications from './notifications';
import password from './password';
import search from './search';
import settingsAbout from './settings/about';
import settingsApps from './settings/apps';
import settingsAssignments from './settings/assignments';
import settingsConfigs from './settings/configs';
import settingsPlugins from './settings/plugins';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggables';

// creators
import createActorAdmins from './actor/admins';
import createActorApps from './actor/apps';
import createActorFollowRequests from './actor/followrequests';
import createActorPermissions from './actor/permissions';
import createActorPrivacy from './actor/privacy';
import createActorsReducer from './createActors';
import createCommentReducer from './createComment';
import createMediaReducer from './createMedia';

// create actors reducers
const likes = createActorsReducer('likes');
const people = createActorsReducer('people');
const peopleApps = createActorApps('people_apps');
const peopleFollowRequests = createActorFollowRequests('people_followrequests');
const peoplePermissions = createActorPermissions('people_permissions');
const peoplePrivacy = createActorPrivacy('people_privacy');

const groups = createActorsReducer('groups');
const groupsAdmins = createActorAdmins('groups_admins');
const groupsApps = createActorApps('groups_apps');
const groupsFollowRequests = createActorFollowRequests('groups_followrequests');
const groupsPermissions = createActorPermissions('groups_permissions');
const groupsPrivacy = createActorPrivacy('groups_privacy');

// create media reducers
const articles = createMediaReducer('articles');
const documents = createMediaReducer('documents');
const notes = createMediaReducer('notes');
const topics = createMediaReducer('topics');
const todos = createMediaReducer('todos');
const photos = createMediaReducer('photos');

// behaviours
const comments = createCommentReducer('comments');

export default combineReducers({
  app,
  articles,
  avatar,
  comments,
  documents,
  cover,
  groups,
  groupsAdmins,
  groupsApps,
  groupsFollowRequests,
  groupsPermissions,
  groupsPrivacy,
  commentsInline,
  likes,
  locations,
  locationsGraph,
  hashtags,
  notes,
  notifications,
  password,
  people,
  peopleApps,
  peopleFollowRequests,
  peoplePermissions,
  peoplePrivacy,
  photos,
  search,
  settingsAbout,
  settingsApps,
  settingsAssignments,
  settingsConfigs,
  settingsPlugins,
  session,
  signup,
  socialgraph,
  stories,
  taggables,
  topics,
  todos,
});
