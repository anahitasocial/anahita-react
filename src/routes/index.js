import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

import AuthPage from '../containers/auth';
import PasswordResetPage from '../containers/auth/PasswordReset';

import HomePage from '../containers/Home';

import ActorsBrowse from '../containers/actors/Browse';
import ActorsRead from '../containers/actors/Read';
import ActorsAdd from '../containers/actors/Add';
import ActorsSettings from '../containers/actors/Settings';
import ActorsEdit from '../containers/actors/settings/Info';
import ActorsDelete from '../containers/actors/settings/Delete';

import PeopleAdd from '../containers/people/Add';
import PersonSettingsInfo from '../containers/people/settings/Info';
import PersonSettingsAccount from '../containers/people/settings/Account';

import MediaBrowse from '../containers/media/Browse';

import HashtagsBrowse from '../containers/hashtags/Browse';
import HashtagsRead from '../containers/hashtags/Read';

import LocationsBrowse from '../containers/locations/Browse';
import LocationsRead from '../containers/locations/Read';

import DashboardPage from '../containers/Dashboard';
import NotFoundPage from '../containers/NotFound';

const GroupsBrowse = ActorsBrowse('groups');
const GroupsRead = ActorsRead('groups');
const GroupsAdd = ActorsAdd('groups');
const GroupsEdit = ActorsEdit('groups');
const GroupsDelete = ActorsDelete('groups');
const GroupsSettings = ActorsSettings('groups');

const PeopleBrowse = ActorsBrowse('people');
const PeopleRead = ActorsRead('people');
const PeopleDelete = ActorsDelete('people');
const PeopleSettings = ActorsSettings('people');

const ArticlesBrowse = MediaBrowse('articles');
const NotesBrowse = MediaBrowse('notes');
const PhotosBrowse = MediaBrowse('photos');
const TopicsBrowse = MediaBrowse('topics');
const TodosBrowse = MediaBrowse('todos');

const scrollUp = () => {
  window.scrollTo(0, 0);
};

const Routes = (props) => {
  const { isAuthenticated } = props;

  scrollUp();

  return (
    <Switch>
      <Route
        exact
        path="/"
        component={isAuthenticated ? DashboardPage : HomePage}
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
        path="/people/:id/settings/"
        exact
        component={PeopleSettings}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/info/"
        exact
        component={(params) => {
          return <PersonSettingsInfo {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/account/"
        exact
        component={(params) => {
          return <PersonSettingsAccount {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/deleteforever/"
        exact
        component={PeopleDelete}
      />
      <Route
        exact
        path="/people/"
        component={PeopleBrowse}
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
        path="/groups/"
        component={GroupsBrowse}
      />
      <AuthenticatedRoute
        path="/groups/:id/settings/"
        exact
        component={GroupsSettings}
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
        path="/groups/:id/settings/info/"
        component={(params) => {
          return <GroupsEdit {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/deleteforever/"
        component={(params) => {
          return <GroupsDelete {...params} />;
        }}
      />
      <Route
        exact
        path="/notes/"
        component={NotesBrowse}
      />
      <Route
        exact
        path="/photos/"
        component={PhotosBrowse}
      />
      <Route
        exact
        path="/todos/"
        component={TodosBrowse}
      />
      <Route
        exact
        path="/topics/"
        component={TopicsBrowse}
      />
      <Route
        exact
        path="/articles/"
        component={ArticlesBrowse}
      />
      <Route
        exact
        path="/hashtags/"
        component={HashtagsBrowse}
      />
      <Route
        exact
        path="/hashtags/:alias/"
        component={HashtagsRead}
      />
      <Route
        exact
        path="/locations/"
        component={LocationsBrowse}
      />
      <Route
        exact
        path="/locations/:id/"
        component={LocationsRead}
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
