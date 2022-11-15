import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Login from './Login';
import Signup from './Signup';
import i18n from '../../languages';

const Auth = (props) => {
  const { match: { params } } = props;
  const defaultTab = params.tab === 'signup' ? 1 : 0;

  const [tab, setTab] = React.useState(defaultTab);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const signupClosed = process.env.REACT_APP_SIGNUP_CLOSED || false;

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
      >
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={i18n.t('auth:mTitle')} />
          {!signupClosed && <Tab label={i18n.t('auth:signup.mTitle')} />}
        </Tabs>
      </AppBar>
      {tab === 0 && <Login />}
      {tab === 1 && !signupClosed && <Signup />}
    </>
  );
};

Auth.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Auth;
