import React from 'react'

import {
  hashHistory,
  Router,
  Route,
  IndexRoute,
  //IndexRedirect,
} from 'react-router';

import App from '../containers/App'
import Welcome from '../components/Welcome'
import Dashboard from '../components/Dashboard'

import * as actionCreators from '../actions';
import { bindAllActionCreators } from '../actions/utils';

export default function (store) {

    const actions = bindAllActionCreators(actionCreators, store.dispatch);
    const scrollUp = () => window.scrollTo(0, 0);

    const requireAuth = (nextState, replace) => {

      const { auth } = store.getState();

      if (!auth.isLoggedIn) {
        actions.alerts.warning('You have to be signed in first');
        actions.auth.loginRequired(nextState.location.pathname);
        replace('/login/');
      }
    };

    const redirectIfLoggedIn = (_, replace) => {
      const { auth } = store.getState();

      if (auth.isLoggedIn) {
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
            </Route>
        </Router>
    )
}
