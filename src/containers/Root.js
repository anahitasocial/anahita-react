import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@material-ui/core/styles';
import { LoadScriptNext } from '@react-google-maps/api';
import App from './App';
import Routes from '../routes';
import styles from '../styles';
import i18n from '../languages';

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
        <LoadScriptNext
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          language={i18n.language}
          loadingElement={<div />}
        >
          <HelmetProvider>
            <App>
              <Routes store={store} />
            </App>
          </HelmetProvider>
        </LoadScriptNext>
      </ThemeProvider>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
