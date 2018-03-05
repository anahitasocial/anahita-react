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
import PersonPage from '../containers/people/PersonPage';
import PersonSettingsPage from '../containers/people/PersonSettingsPage';
import GroupsPage from '../containers/groups/GroupsPage';
import GroupPage from '../containers/groups/GroupPage';
import DashboardPage from '../containers/DashboardPage';
import PageNotFound from '../containers/PageNotFound';

const scrollUp = () => window.scrollTo(0, 0);

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
          store={store}
          component={PersonSettingsPage}
        />
        <Route
          exact
          path="/people/"
          component={PeoplePage}
        />
        <Route
          exact
          path="/people/:id/"
          component={PersonPage}
        />
        <Route
          exact
          path="/groups/"
          component={GroupsPage}
        />
        <Route
          exact
          path="/groups/:id/"
          component={GroupPage}
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
