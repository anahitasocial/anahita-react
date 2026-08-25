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

  useEffect(() => {
    api.totp.isTotp(viewer.email)
      .then((response) => {
        setTotpEnabled(response.status === 200);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

const mapStateToProps = (state) => {
  const { viewer } = state.auth;
  return {
    viewer,
  };
};

TotpWidget.propTypes = {
  viewer: PersonType.isRequired,
};

export default connect(mapStateToProps)(TotpWidget);
