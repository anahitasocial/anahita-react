import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
// import fr from 'javascript-time-ago/locale/fr';
import './languages';
import Root from './containers/Root';
import configureStore from './store';

// Initialize the desired locales.
JavascriptTimeAgo.locale(en);
// JavascriptTimeAgo.locale(fr);

const store = configureStore();

render(
  <BrowserRouter>
    <Root store={store} />
  </BrowserRouter>,
  document.getElementById('root'),
);
