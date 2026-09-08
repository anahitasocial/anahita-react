import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import Routes from '../routes';
import styles from '../styles';

const Root = ({ store }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => {
      return styles(prefersDarkMode);
    },
    [prefersDarkMode],
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <App>
            <Routes store={store} />
          </App>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
