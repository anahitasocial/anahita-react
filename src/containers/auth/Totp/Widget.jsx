/* eslint-disable no-console */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';

import api from '../../../api';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

const TotpWidget = ({ viewer }) => {
  const [totpEnabled, setTotpEnabled] = useState(true);

  // api.totp.isTotp never existed, so this threw a TypeError on every
  // render and the widget stayed permanently hidden by its initial
  // true. The check lives in api/is: /auth/is/totp answers 200 when the
  // account has TOTP and 404 when it does not, and is.totp turns that
  // into a boolean.
  //
  // Starts true so nothing flashes on screen before the answer arrives.
  // Failing closed on error is the same call: a prompt to enable 2FA
  // shown to somebody who already has it is worse than one not shown.
  useEffect(() => {
    api.is.totp(viewer.email)
      .then((enabled) => {
        setTotpEnabled(enabled);
      })
      .catch(() => {
        setTotpEnabled(true);
      });
  }, [viewer.email]);

  if (totpEnabled) {
    return (<div />);
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={i18n.t('auth:totp.widget.cTitle')}
        subheader={i18n.t('auth:totp.widget.cSubTitle')}
      />
      <Divider />
      <CardContent>
        {i18n.t('auth:totp.widget.cDesc')}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          href="/totp"
        >
          {i18n.t('auth:totp.widget.action')}
        </Button>
      </CardActions>
    </Card>
  );
};

// state.session, not state.auth. There is no auth reducer — see
// reducers/index.js — so this destructuring threw before the component
// ever rendered.
const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return {
    viewer,
  };
};

TotpWidget.propTypes = {
  viewer: PersonType.isRequired,
};

export default connect(mapStateToProps)(TotpWidget);
