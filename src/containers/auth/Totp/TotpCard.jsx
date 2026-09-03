import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import i18n from '../../../languages';

// Collapsed state of the two-factor card.
//
// The enrolment wizard used to be what this section opened on: a password
// prompt, a QR code and a set of recovery codes, all on a settings page most
// people arrive at to read something else. It now sits behind this button,
// matching the password, email and username cards beside it.
//
// Three states rather than two, because the enrolled/not-enrolled answer comes
// from the server and takes a moment. Rendering "off" while that request is in
// flight would tell a person with 2FA enabled that they do not have it, which
// is the one wrong answer worth avoiding here.
const TotpCard = ({
  loading,
  enabled,
  onEnable,
}) => {
  return (
    <Card>
      <CardHeader
        title={i18n.t('auth:totp.cTitle')}
        subheader={enabled
          ? i18n.t('auth:totp.enable.on')
          : i18n.t('auth:totp.enable.off')}
      />
      <Divider />
      <CardContent>
        {loading &&
          <CircularProgress size={24} />}
        {!loading &&
          <Typography variant="body2" color="textSecondary">
            {enabled
              ? i18n.t('auth:totp.enable.onDesc')
              : i18n.t('auth:totp.cDesc')}
          </Typography>}
      </CardContent>

      {/* No button once it is on. Turning 2FA back off is a destructive action
          with its own confirmation dialog (auth:totp.disableDialog) and no
          route wired to it yet, so this card does not offer one rather than
          offering one that does nothing. */}
      {!loading && !enabled &&
        <CardActions>
          <Button
            onClick={onEnable}
            color="primary"
            variant="outlined"
            fullWidth
          >
            {i18n.t('auth:totp.enable.action')}
          </Button>
        </CardActions>}
    </Card>
  );
};

TotpCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  onEnable: PropTypes.func.isRequired,
};

export default TotpCard;
