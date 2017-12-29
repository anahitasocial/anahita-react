import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';

import configureStore from './store';
import configureRoutes from './routes';

const store = configureStore();
const routes = configureRoutes(store);

render(
  <Root store={store} routes={routes} />,
  document.getElementById('root')
)
