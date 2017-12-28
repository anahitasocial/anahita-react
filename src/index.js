import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
//import { auth } from './actions';

import configureStore from './store';
import configureRoutes from './routes';

const store = configureStore();
const routes = configureRoutes(store);

//store.dispatch(auth.setCurrentUser(window.localStorage.getItem('viewer')));

render(
  <Root store={store} routes={routes} />,
  document.getElementById('root')
)
