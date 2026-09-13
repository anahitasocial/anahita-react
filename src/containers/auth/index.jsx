import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Signup from './Signup';
import api from '../../api';
import i18n from '../../languages';

// Whether this site takes registrations is the SERVER's answer, read from
// NodeInfo.
//
// It used to be REACT_APP_SIGNUP_CLOSED, a build-time variable in the browser.
// That hid the tab and nothing else: POST /signups stayed open to anybody who
// noticed it existed, so "signups are closed" was true of the interface and
// false of the service. The flag is gone.
//
// Starts as null — not-yet-known, which is different from open and from
// closed. Rendering the tab before the answer arrives shows a form that may be
// about to be refused; rendering nothing shows a bare page to somebody on a
// site that is open. So neither is shown until it is known.
const Auth = () => {
  const defaultTab = useParams().tab === 'signup' ? 1 : 0;

  const [tab, setTab] = useState(defaultTab);
  const [signupOpen, setSignupOpen] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.nodeinfo.read()
      .then(({ data }) => {
        if (!cancelled) {
          setSignupOpen(Boolean(data.openRegistrations));
        }
      })
      .catch(() => {
        // A NodeInfo this client cannot read means the answer is unknown, and
        // unknown is treated as closed. Offering a form that is about to be
        // refused is a worse failure than not offering one — somebody who was
        // invited still has their link, and it does not come through here.
        if (!cancelled) {
          setSignupOpen(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  if (signupOpen === null) {
    return null;
  }

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
          {signupOpen && <Tab label={i18n.t('auth:signup.mTitle')} />}
        </Tabs>
      </AppBar>
      {tab === 1 && signupOpen && <Signup />}
      {/* Said rather than left blank. A page with a sign-in tab and nothing
          else reads as broken; this reads as a decision, which it is. */}
      {!signupOpen &&
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ padding: 16 }}
        >
          {i18n.t('auth:signup.closed')}
        </Typography>}
    </>
  );
};

export default Auth;
