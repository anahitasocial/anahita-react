import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

import LoginPage from '../containers/people/Login';
import SignupPage from '../containers/people/Signup';
import PasswordResetPage from '../containers/people/PasswordReset';
import HomePage from '../containers/Home';

import ActorsPage from '../containers/actors/Actors';
import ActorPage from '../containers/actors/Actor';
import ActorAddPage from '../containers/actors/ActorAdd';
import ActorSettingsPage from '../containers/actors/ActorSettings';
import ActorSettingsInfoPage from '../containers/actors/ActorSettingsInfo';
import ActorSettingsDeletePage from '../containers/actors/ActorSettingsDelete';

import PeoplePage from '../containers/people/People';
import PersonAddPage from '../containers/people/PersonAdd';
import PersonSettingsInfoPage from '../containers/people/PersonSettingsInfo';
import PersonSettingsAccountPage from '../containers/people/PersonSettingsAccount';

import NotesPage from '../containers/Notes';
import PhotosPage from '../containers/Photos';
import TopicsPage from '../containers/Topics';
import ArticlesPage from '../containers/Articles';

import DashboardPage from '../containers/Dashboard';
import NotFoundPage from '../containers/NotFound';

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
          return <ActorSettingsPage namespace="people" {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/info/"
        exact
        component={(params) => {
          return <PersonSettingsInfoPage {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/account/"
        exact
        component={(params) => {
          return <PersonSettingsAccountPage {...params} />;
        }}
      />
      <AuthenticatedRoute
        path="/people/:id/settings/deleteforever/"
        exact
        component={(params) => {
          return <ActorSettingsDeletePage namespace="people" {...params} />;
        }}
      />
      <Route
        exact
        path="/people/"
        component={PeoplePage}
      />
      <AuthenticatedRoute
        exact
        path="/people/add/"
        component={(params) => {
          return <PersonAddPage {...params} />;
        }}
      />
      <Route
        exact
        path="/people/:id/"
        component={(params) => {
          return <ActorPage namespace="people" {...params} />;
        }}
      />
      <Route
        exact
        path="/groups/"
        component={(params) => {
          return <ActorsPage namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/add/"
        component={(params) => {
          return <ActorAddPage namespace="groups" {...params} />;
        }}
      />
      <Route
        exact
        path="/groups/:id/"
        component={(params) => {
          return <ActorPage namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/"
        component={(params) => {
          return <ActorSettingsPage namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/info/"
        component={(params) => {
          return <ActorSettingsInfoPage namespace="groups" {...params} />;
        }}
      />
      <AuthenticatedRoute
        exact
        path="/groups/:id/settings/deleteforever/"
        component={(params) => {
          return <ActorSettingsDeletePage namespace="groups" {...params} />;
        }}
      />
      <Route
        exact
        path="/notes/"
        component={NotesPage}
      />
      <Route
        exact
        path="/photos/"
        component={PhotosPage}
      />
      <Route
        exact
        path="/topics/"
        component={TopicsPage}
      />
      <Route
        exact
        path="/articles/"
        component={ArticlesPage}
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
