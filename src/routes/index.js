import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

import AuthPage from '../containers/auth';
import AuthToken from '../containers/auth/Token';
import PasswordResetPage from '../containers/auth/PasswordReset';

import HomePage from '../containers/home';

import Actors from '../containers/actors';
import ActorsRead from '../containers/actors/read';
import ActorsAdd from '../containers/actors/Add';
import ActorsSettings from '../containers/actors/settings';
import ActorsNotificationsEdit from '../containers/actors/notifications/Edit';

import Blogs from '../containers/blogs';

import Hashtags from '../containers/hashtags';
import HashtagsRead from '../containers/hashtags/Read';

import Locations from '../containers/locations';
import LocationsRead from '../containers/locations/Read';

import Media from '../containers/media';
import MediaRead from '../containers/media/Read';

import Notifications from '../containers/notifications';

import People from '../containers/people';
import PeopleAdd from '../containers/people/Add';

import DashboardPage from '../containers/Dashboard';
import ExplorePage from '../containers/Explore';
import SearchPage from '../containers/search';
import Settings from '../containers/settings';
import StaticPage from '../containers/page';
import NotFoundPage from '../containers/NotFound';

const GroupsBrowse = Actors('groups');
const GroupsRead = ActorsRead('groups');
const GroupsAdd = ActorsAdd('groups');
const GroupsSettings = ActorsSettings('groups');
const GroupsNotificationsEdit = ActorsNotificationsEdit('groups');

const PeopleRead = ActorsRead('people');
const PeopleSettings = ActorsSettings('people');
const PeopleNotificationsEdit = ActorsNotificationsEdit('people');

const Articles = Media('articles');
const ArticlesRead = MediaRead('articles');

const Documents = Media('documents');
const DocumentsRead = MediaRead('documents');

const Notes = Media('notes');
const NotesRead = MediaRead('notes');

const Photos = Media('photos');
const PhotosRead = MediaRead('photos');

const Topics = Media('topics');
const TopicsRead = MediaRead('topics');

const Todos = Media('todos');
const TodosRead = MediaRead('todos');

const scrollUp = () => {
  window.scrollTo(0, 0);
};

const Routes = (props) => {
  const { isAuthenticated } = props;

  scrollUp();

  if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
      debug: process.env.NODE_ENV === 'development' && false,
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  return (
    <Switch>
      <Route
        exact
        path="/"
        component={isAuthenticated ? DashboardPage : HomePage}
      />
      <AuthenticatedRoute
        exact
        path="/about/"
        component={HomePage}
      />
      <Route
        exact
        path="/blogs/"
        component={Blogs}
      />
      <Route
        exact
        path="/explore/"
        component={ExplorePage}
      />
      <Route
        exact
        path="/explore/:tab/"
        component={ExplorePage}
      />
      <Route
        exact
        path="/search/"
        component={SearchPage}
      />
      <Route
        exact
        path="/token/:token/resetpassword/"
        render={(params) => {
          return (
            <AuthToken resetPassword {...params} />
          );
        }}
      />
      <Route
        exact
        path="/token/:token/"
        component={AuthToken}
      />
      <Route
        exact
        path="/auth/"
        component={AuthPage}
      />
      <Route
        exact
        path="/auth/:tab/"
        component={AuthPage}
      />
      <Route
        exact
        path="/auth/:tab/"
        component={AuthPage}
      />
      <Route
        exact
        path="/passwordreset/"
        component={PasswordResetPage}
      />
      <AuthenticatedRoute
        path="/dashboard/"
        component={DashboardPage}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/account"
        exact
        component={PeopleSettings}
        selectedTab="account"
      />
      <AuthenticatedRoute
        path="/people/:id/settings/privacy"
        exact
        component={PeopleSettings}
        selectedTab="privacy"
      />
      <AuthenticatedRoute
        path="/people/:id/settings/apps"
        exact
        component={PeopleSettings}
        selectedTab="apps"
      />
      <AuthenticatedRoute
        path="/people/:id/settings/permissions"
        exact
        component={PeopleSettings}
        selectedTab="permissions"
      />
      <AuthenticatedRoute
        path="/people/:id/settings/"
        exact
        component={PeopleSettings}
      />
      <AuthenticatedRoute
        exact
        path="/people/:id/notifications/"
        component={(params) => {
          return <PeopleNotificationsEdit {...params} />;
        }}
      />
      <Route
        exact
        path="/people/"
        component={People}
      />
      <AuthenticatedRoute
        exact
        path="/people/add/"
        component={(params) => {
          return <PeopleAdd {...params} />;
        }}
      />
      <Route
        exact
        path="/people/:id/"
        component={(params) => {
          return <PeopleRead {...params} />;
        }}
      />
      <Route
        exact
        path="/people/:id/:tab/:subtab"
        component={(params) => {
          return <PeopleRead {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/groups/:id/settings/"
        exact
        component={GroupsSettings}
      />
      <Route
        exact
        path="/groups/"
        component={GroupsBrowse}
      />
      <AuthenticatedRoute
        exact
        path="/groups/add/"
        component={(params) => {
          return <GroupsAdd {...params} />;
        }}
      />
      <Route
        exact
        path="/groups/:id/"
        component={(params) => {
          return <GroupsRead {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/"
        component={(params) => {
          return <GroupsSettings {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/notifications/"
        component={(params) => {
          return <GroupsNotificationsEdit {...params} />;
        }}
      />
      <Route
        exact
        path="/groups/:id/:tab/:subtab"
        component={(params) => {
          return <GroupsRead {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/notifications/"
        component={Notifications}
      />
      <AuthenticatedRoute
        exact
        path="/settings/"
        component={Settings}
      />
      <Route
        exact
        path="/articles/"
        component={Articles}
      />
      <Route
        exact
        path="/articles/:id/"
        component={(params) => {
          return <ArticlesRead {...params} />;
        }}
      />
      <Route
        exact
        path="/documents/"
        component={Documents}
      />
      <Route
        exact
        path="/documents/:id/"
        component={(params) => {
          return <DocumentsRead {...params} />;
        }}
      />
      <Route
        exact
        path="/notes/"
        component={Notes}
      />
      <Route
        exact
        path="/notes/:id/"
        component={(params) => {
          return <NotesRead {...params} />;
        }}
      />
      <Route
        exact
        path="/pages/:alias"
        component={StaticPage}
      />
      <Route
        exact
        path="/photos/"
        component={Photos}
      />
      <Route
        exact
        path="/photos/:id/"
        component={(params) => {
          return <PhotosRead {...params} />;
        }}
      />
      <Route
        exact
        path="/todos/"
        component={Todos}
      />
      <Route
        exact
        path="/todos/:id/"
        component={(params) => {
          return <TodosRead {...params} />;
        }}
      />
      <Route
        exact
        path="/topics/"
        component={Topics}
      />
      <Route
        exact
        path="/topics/:id/"
        component={(params) => {
          return <TopicsRead {...params} />;
        }}
      />
      <Route
        exact
        path="/hashtags/"
        component={Hashtags}
      />
      <Route
        exact
        path="/hashtags/:alias/"
        component={HashtagsRead}
      />
      <Route
        exact
        path="/locations/"
        component={Locations}
      />
      <Route
        exact
        path="/locations/:id/"
        component={LocationsRead}
      />
      <Route
        exact
        path="/404/"
        component={NotFoundPage}
      />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

Routes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const {
    isAuthenticated,
  } = state.session;

  return {
    isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(Routes));
