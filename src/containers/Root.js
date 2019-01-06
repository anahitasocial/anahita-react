import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Routes from '../routes';

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <Routes store={store} />
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
