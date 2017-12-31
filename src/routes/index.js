import React from 'react'
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import App from '../containers/App';
import Login from '../containers/people/Login';
import Home from '../containers/Home';
import Dashboard from '../containers/Dashboard';
import PageNotFound from '../containers/PageNotFound';

//const scrollUp = () => window.scrollTo(0, 0);

const PrivateRoute = ({ component: Component, store, ...rest }) => {
    const { auth } = store.getState();
    return (
      <Route {...rest} render={ props => (
        auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect push to="/login" />
        )
      )}/>
   );
}

const Routes = (props) => {

    const { store } = props;
    const { auth } = store.getState();
    const homeRedirect = auth.isAuthenticated ? Dashboard : Home;

    return (
        <App>
            <Switch>
                <Route exact path="/" component={homeRedirect} />
                <Route path="/login" component={Login}  />
                <PrivateRoute path="/dashboard" store={store} component={Dashboard} />
                <Route component={PageNotFound} />
            </Switch>
        </App>
    );
}

Routes.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Routes;
