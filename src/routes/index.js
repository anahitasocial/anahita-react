import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

import LoginPage from '../containers/auth/Login';
import SignupPage from '../containers/auth/Signup';
import PasswordResetPage from '../containers/auth/PasswordReset';

import HomePage from '../containers/Home';

import ActorsBrowse from '../containers/actors/Browse';
import ActorsRead from '../containers/actors/Read';
import ActorsAdd from '../containers/actors/Add';
import ActorsSettings from '../containers/actors/Settings';
import ActorsSettingsInfo from '../containers/actors/settings/Info';
import ActorsSettingsDelete from '../containers/actors/settings/Delete';

import PeopleAdd from '../containers/people/Add';
import PersonSettingsInfo from '../containers/people/settings/Info';
import PersonSettingsAccount from '../containers/people/settings/Account';

import NotesBrowse from '../containers/notes/Browse';
import PhotosBrowse from '../containers/photos/Browse';
import TopicsBrowse from '../containers/topics/Browse';
import ArticlesBrowse from '../containers/articles/Browse';

import HashtagsBrowse from '../containers/hashtags/Browse';
import HashtagsRead from '../containers/hashtags/Read';

import LocationsBrowse from '../containers/locations/Browse';
import LocationsRead from '../containers/locations/Read';

import DashboardPage from '../containers/Dashboard';
import NotFoundPage from '../containers/NotFound';

const GroupsBrowse = ActorsBrowse('groups');
const GroupsRead = ActorsRead('groups');

const PeopleBrowse = ActorsBrowse('people');
const PeopleRead = ActorsRead('people');

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
        path="/login/"
        component={LoginPage}
      />
      <Route
        exact
        path="/signup/"
        component={SignupPage}
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
        component={(params) => {
          return <ActorsSettings namespace="people" {...params} />;
        }}
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
        component={(params) => {
          return <ActorsSettingsDelete namespace="people" {...params} />;
        }}
      />
      <Route
        exact
        path="/people/"
        component={(params) => {
          return <PeopleBrowse {...params} />;
        }}
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
        component={(params) => {
          return <GroupsBrowse {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/add/"
        component={(params) => {
          return <ActorsAdd namespace="groups" {...params} />;
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
          return <ActorsSettings namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/info/"
        component={(params) => {
          return <ActorsSettingsInfo namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/deleteforever/"
        component={(params) => {
          return <ActorsSettingsDelete namespace="groups" {...params} />;
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
  isAuthenticated: PropTypes.bool,
};

Routes.defaultProps = {
  isAuthenticated: false,
};

function mapStateToProps(state) {
  const {
    isAuthenticated,
  } = state.auth;

  return {
    isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(Routes));
