import React from 'react'

import {
  hashHistory,
  Router,
  Route,
  IndexRoute,
  //IndexRedirect,
} from 'react-router';

import App from '../containers/App';
import Login from '../containers/people/Login';
import Welcome from '../containers/Welcome';
import Dashboard from '../containers/Dashboard';
import PageNotFound from '../containers/PageNotFound';

import * as actionCreators from '../actions';
import { bindAllActionCreators } from '../actions/utils';

export default function (store) {

    const actions = bindAllActionCreators(actionCreators, store.dispatch);
    const scrollUp = () => window.scrollTo(0, 0);

    const requireAuth = (nextState, replace) => {
      const { auth } = store.getState();
      if (!auth.isAuthenticated) {
        actions.alerts.warning('You have to be signed in first');
        actions.auth.loginRequired(nextState.location.pathname);
        replace('/people/login/');
      }
    };

    const redirectIfLoggedIn = (_, replace) => {
      const { auth } = store.getState();
      if (auth.isAuthenticated) {
        replace('/dashboard/');
      }
    };

    return (
        <Router history={hashHistory} onUpdate={scrollUp}>
            <Route path="/" component={App}>
                <IndexRoute
                  component={Welcome}
                  onEnter={redirectIfLoggedIn}
                />
                <Route
                  path="/dashboard/"
                  component={Dashboard}
                  onEnter={requireAuth}
                />
                <Route
                  path="/people/login/"
                  component={Login}
                  onEnter={redirectIfLoggedIn}
                />
                <Route path="*" component={PageNotFound} />
            </Route>
        </Router>
    )
}
