import React from 'react';
import { useParams } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Signup from './Signup';
import i18n from '../../languages';

const Auth = () => {
  const defaultTab = useParams().tab === 'signup' ? 1 : 0;

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
          {!signupClosed && <Tab label={i18n.t('auth:signup.mTitle')} />}
        </Tabs>
      </AppBar>
      {tab === 1 && !signupClosed && <Signup />}
    </>
  );
};

export default Auth;
