import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import i18n from '../../../languages';
import OAuthClientType from '../../../proptypes/OAuthClient';

const useStyles = makeStyles((theme) => {
  return {
    secret: {
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      wordBreak: 'break-all',
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    clientId: {
      fontFamily: 'monospace',
    },
  };
});

// The client secret, shown the only time it exists in readable form.
//
// auth-service generates 48 random bytes, hands back the base64 of them
// once, and stores nothing but a hash. There is no endpoint that can
// produce it again; the only recovery is rotation, which invalidates
// every refresh token the client holds. So this dialog is the whole of
// the operator's opportunity, and it is built to be hard to lose:
//
//   - no onClose and no escape key, so it cannot be dismissed by a
//     stray click on the backdrop while somebody is reaching for the
//     copy button
//   - one way out, a button that says what it means
//
// It is deliberately not an alert. Alerts in this app auto-dismiss, and
// a secret that scrolls away after four seconds is a secret lost.
const OAuthClientSecret = ({
  secret = null,
  onClose,
}) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [secret]);

  if (!secret) {
    return null;
  }

  const { client, rotated } = secret;

  const handleCopy = () => {
    // Clipboard access is not guaranteed — it needs a secure context
    // and, in some browsers, a permission. A failure is not worth an
    // error dialog: the secret is on screen and selectable, which is
    // the fallback anyway. The button simply does not claim success.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(client.clientSecret)
        .then(() => {
          setCopied(true);
        })
        .catch(() => {
          setCopied(false);
        });
    }
  };

  return (
    <Dialog
      open
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      aria-labelledby="oauth-client-secret-title"
    >
      <DialogTitle id="oauth-client-secret-title">
        {rotated ?
          i18n.t('settings:oauthClients.secret.rotatedTitle') :
          i18n.t('settings:oauthClients.secret.createdTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          {i18n.t('settings:oauthClients.secret.cDescription')}
        </DialogContentText>

        <Typography variant="caption" color="textSecondary" display="block">
          {i18n.t('settings:oauthClients.fields.clientId')}
        </Typography>
        <Typography className={classes.clientId} gutterBottom>
          {client.clientId}
        </Typography>

        <Typography variant="caption" color="textSecondary" display="block">
          {i18n.t('settings:oauthClients.secret.label')}
        </Typography>
        <Box className={classes.secret}>
          {client.clientSecret}
        </Box>

        {rotated &&
          <DialogContentText variant="body2">
            {i18n.t('settings:oauthClients.secret.rotatedWarning')}
          </DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={handleCopy}>
          {copied ?
            i18n.t('settings:oauthClients.secret.copied') :
            i18n.t('settings:oauthClients.secret.copy')}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          {i18n.t('settings:oauthClients.secret.done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OAuthClientSecret.propTypes = {
  secret: PropTypes.shape({
    client: PropTypes.oneOfType([
      OAuthClientType,
      PropTypes.shape({ clientSecret: PropTypes.string }),
    ]).isRequired,
    rotated: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
};

export default OAuthClientSecret;
