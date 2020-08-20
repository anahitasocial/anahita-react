import { combineReducers } from 'redux';

import app from './app';
import avatar from './avatar';
import inlineComments from './inline_comments';
import cover from './cover';
import likes from './likes';
import locations from './locations';
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
import createActorApps from './actor/apps';
import createActorPermissions from './actor/permissions';
import createActorsReducer from './create_actors';
import createCommentReducer from './create_comment';
import createTagGraphReducer from './create_tag_graph';
import createMediaReducer from './createMedia';

// create actors reducers
const people = createActorsReducer('people');
const peopleApps = createActorApps('people_apps');
const peoplePermissions = createActorPermissions('people_permissions');

const groups = createActorsReducer('groups');
const groupsApps = createActorsReducer('groups_apps');
const groupsPermissions = createActorPermissions('groups_permissions');

// create media reducers
const notes = createMediaReducer('notes');
const topics = createMediaReducer('topics');
const todos = createMediaReducer('todos');
const photos = createMediaReducer('photos');
const articles = createMediaReducer('articles');

// behaviours
const comments = createCommentReducer('comments');

// location graph
const locationsGraph = createTagGraphReducer('locationsGraph');

export default combineReducers({
  app,
  articles,
  avatar,
  comments,
  cover,
  groups,
  groupsApps,
  groupsPermissions,
  inlineComments,
  likes,
  locations,
  locationsGraph,
  hashtags,
  notes,
  notifications,
  password,
  people,
  peopleApps,
  peoplePermissions,
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
