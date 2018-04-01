import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import App from '../containers/App';
import LoginPage from '../containers/people/LoginPage';
import HomePage from '../containers/HomePage';
import PeoplePage from '../containers/people/PeoplePage';
import ActorSettingsPage from '../containers/actors/ActorSettingsPage';
import ActorSettingsInfoPage from '../containers/actors/ActorSettingsInfoPage';
import PersonSettingsInfoPage from '../containers/people/PersonSettingsInfoPage';
import PersonSettingsAccountPage from '../containers/people/PersonSettingsAccountPage';
import ActorsPage from '../containers/actors/ActorsPage';
import ActorPage from '../containers/actors/ActorPage';
import DashboardPage from '../containers/DashboardPage';
import PageNotFound from '../containers/PageNotFound';

const scrollUp = () => {
  window.scrollTo(0, 0);
};

const PrivateRoute = ({
  component: Component,
  store,
  ...rest
}) => {
  const { authReducer } = store.getState();
  const { isAuthenticated } = authReducer;
  return (
    <Route
      {...rest}
      render={props => (
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Route component={LoginPage} />
      ))}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const Routes = (props) => {
  const { store } = props;
  const { authReducer } = store.getState();
  const homeRedirect = authReducer.isAuthenticated ? DashboardPage : HomePage;

  scrollUp();

  return (
    <App>
      <Switch>
        <Route
          exact
          path="/"
          component={homeRedirect}
        />
        <Route
          exact
          path="/login/"
          component={LoginPage}
        />
        <PrivateRoute
          path="/dashboard/"
          store={store}
          component={DashboardPage}
        />
        <PrivateRoute
          path="/people/:id/settings/"
          exact
          store={store}
          component={(params) => {
            return <ActorSettingsPage namespace="people" {...params} />;
          }}
        />
        <PrivateRoute
          path="/people/:id/settings/info/"
          exact
          store={store}
          component={(params) => {
            return <PersonSettingsInfoPage {...params} />;
          }}
        />
        <PrivateRoute
          exact
          path="/people/:id/settings/account/"
          store={store}
          component={(params) => {
            return <PersonSettingsAccountPage {...params} />;
          }}
        />
        <Route
          exact
          path="/people/"
          component={PeoplePage}
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
        <Route
          exact
          path="/groups/:id/"
          component={(params) => {
            return <ActorPage namespace="groups" {...params} />;
          }}
        />
        <PrivateRoute
          exact
          path="/groups/:id/settings/"
          store={store}
          component={(params) => {
            return <ActorSettingsPage namespace="groups" {...params} />;
          }}
        />
        <PrivateRoute
          exact
          path="/groups/:id/settings/info/"
          store={store}
          component={(params) => {
            return <ActorSettingsInfoPage namespace="groups" {...params} />;
          }}
        />
        <Route component={PageNotFound} />
      </Switch>
    </App>
  );
};

Routes.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Routes;
