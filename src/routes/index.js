import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';
import App from '../containers/App';

import LoginPage from '../containers/people/LoginPage';
import SignupPage from '../containers/people/SignupPage';
import PasswordResetPage from '../containers/people/PasswordResetPage';
import HomePage from '../containers/HomePage';

import ActorsPage from '../containers/actors/ActorsPage';
import ActorPage from '../containers/actors/ActorPage';
import ActorAddPage from '../containers/actors/ActorAddPage';
import ActorSettingsPage from '../containers/actors/ActorSettingsPage';
import ActorSettingsInfoPage from '../containers/actors/ActorSettingsInfoPage';
import ActorSettingsDeletePage from '../containers/actors/ActorSettingsDeletePage';

import PeoplePage from '../containers/people/PeoplePage';
import PersonAddPage from '../containers/people/PersonAddPage';
import PersonSettingsInfoPage from '../containers/people/PersonSettingsInfoPage';
import PersonSettingsAccountPage from '../containers/people/PersonSettingsAccountPage';

import DashboardPage from '../containers/DashboardPage';
import PageNotFound from '../containers/PageNotFound';

const scrollUp = () => {
  window.scrollTo(0, 0);
};

const Routes = (props) => {
  const { isAuthenticated } = props;

  scrollUp();

  return (
    <App>
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
          path="/people/:id/settings/deleteforever"
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
            console.log('/groups/add/');
            return <ActorAddPage namespace="groups" {...params} />;
          }}
        />
        <Route
          exact
          path="/groups/:id/"
          component={(params) => {
            console.log('/groups/:id/');
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
        <Route component={PageNotFound} />
      </Switch>
    </App>
  );
};

Routes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const {
    isAuthenticated,
  } = state.authReducer;

  return {
    isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(Routes));
