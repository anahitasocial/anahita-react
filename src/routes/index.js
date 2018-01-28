import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import App from '../containers/App';
import LoginPage from '../containers/people/LoginPage';
import HomePage from '../containers/HomePage';
import DashboardPage from '../containers/DashboardPage';
import PageNotFound from '../containers/PageNotFound';

const scrollUp = () => window.scrollTo(0, 0);

const PrivateRoute = ({
  component: Component,
  store,
  ...rest
}) => {
  const { auth } = store.getState();
  return (
    <Route
      {...rest}
      render={props => (
      auth.isAuthenticated ? (
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
  const { auth } = store.getState();
  const homeRedirect = auth.isAuthenticated ? DashboardPage : HomePage;

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
        <Route component={PageNotFound} />
      </Switch>
    </App>
  );
};

Routes.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Routes;
