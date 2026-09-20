import { combineReducers } from 'redux';
import createReducer from './create';

import app from './app';
import commentsInline from './commentsInline';
import locations from './locations';
import locationsGraph from './locationsGraph';
import hashtags from './hashtags';
import notifications from './notifications';
import password from './password';
import search from './search';
import session from './session';
import socialgraph from './socialgraph';
import stories from './stories';

// creators
import createActorAdmins from './actor/admins';
import createActorApps from './actor/apps';
import createActorFollowRequests from './actor/followRequests';
import createActorsReducer from './createActors';
import createCommentReducer from './createComment';
import createMediaReducer from './createMedia';
import createFeed from './createFeed';

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
  ],
  nodes: [
    'inbounds',
    'blogs',
  ],
};

const reducers = {
  app,
  commentsInline,
  locations,
  locationsGraph,
  hashtags,
  notifications,
  password,
  search,
  session,
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
  reducers[`${ns}FollowRequests`] = createActorFollowRequests(`${ns}_follow_requests`);
});

namespaces.media.forEach((ns) => {
  reducers[ns] = createMediaReducer(ns);
});

namespaces.nodes.forEach((ns) => {
  reducers[ns] = createReducer(ns, DEFAULT_NODE);
});

reducers.comments = createCommentReducer('comments');

reducers.feedLeaders = createFeed('feed_leaders');
reducers.feedActor = createFeed('feed_actor');

// No oauthClients entry, and no settingsAbout.
//
// Both were store slices nothing dispatched into. settingsAbout was fed
// by actions.settings.about.read(), which has never existed — the
// About tab threw on mount trying to call it. oauthClients went through
// createReducer, which normalises node-shaped browse payloads with
// pagination; OAuth clients are a short unpaginated list and the screen
// read them straight from the api instead.
//
// The settings tabs hold their lists in local state, the way the
// account screens hold passkeys, TOTP status and auth logs.

export default combineReducers(reducers);
