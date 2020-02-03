import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Login from './Login';
import Signup from './Signup';

const Auth = (props) => {
  const { match: { params } } = props;
  const defaultTab = params.tab === 'signup' ? 1 : 0;

  const [tab, setTab] = React.useState(defaultTab);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={1}
      >
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>
      </AppBar>
      {tab === 0 &&
        <Login />
      }
      {tab === 1 &&
        <Signup />
      }
    </React.Fragment>
  );
};

Auth.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Auth;
