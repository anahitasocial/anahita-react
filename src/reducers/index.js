import { combineReducers } from 'redux';
import createReducer from './create';

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
import settingsPlugins from './settings/plugins';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import stories from './stories';

// creators
import createActorAdmins from './actor/admins';
import createActorApps from './actor/apps';
import createActorFollowRequests from './actor/followrequests';
import createActorPermissions from './actor/permissions';
import createActorPrivacy from './actor/privacy';
import createActorsReducer from './createActors';
import createCommentReducer from './createComment';
import createMediaReducer from './createMedia';

import DEFAULT_NODE from '../proptypes/NodeDefault';

const namespaces = {
  actors: [
    'people',
    'groups',
  ],
  media: [
    'articles',
    'documents',
    'notes',
    'photos',
    'topics',
    'todos',
  ],
  nodes: [
    'taggables',
    'blogs',
  ],
};

const reducers = {
  app,
  avatar,
  cover,
  commentsInline,
  locations,
  locationsGraph,
  hashtags,
  notifications,
  password,
  search,
  settingsAbout,
  settingsApps,
  settingsAssignments,
  settingsPlugins,
  session,
  signup,
  socialgraph,
  stories,
};

namespaces.actors.forEach((ns) => {
  if (ns === 'people') {
    reducers.likes = createActorsReducer('likes');
  }
  reducers[ns] = createActorsReducer(ns);
  if (ns !== 'people') {
    reducers[`${ns}Admins`] = createActorAdmins(`${ns}_admins`);
  }
  reducers[`${ns}Apps`] = createActorApps(`${ns}_apps`);
  reducers[`${ns}FollowRequests`] = createActorFollowRequests(`${ns}_followrequests`);
  reducers[`${ns}Permissions`] = createActorPermissions(`${ns}_permissions`);
  reducers[`${ns}Privacy`] = createActorPrivacy(`${ns}_privacy`);
});

namespaces.media.forEach((ns) => {
  reducers[ns] = createMediaReducer(ns);
});

namespaces.nodes.forEach((ns) => {
  reducers[ns] = createReducer(ns, DEFAULT_NODE);
});

reducers.comments = createCommentReducer('comments');

export default combineReducers(reducers);
