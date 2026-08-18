import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PhonelinkIcon from '@material-ui/icons/Phonelink';
import UsbIcon from '@material-ui/icons/Usb';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import moment from 'moment';

import WebAuthnCredentialType from '../../../proptypes/WebAuthnCredential';

const useStyles = makeStyles((theme) => {
  return {
    meta: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: theme.spacing(0.5),
    },
    chip: {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(0.5),
    },
    warning: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(0.5),
      color: theme.palette.error.main,
    },
    warningIcon: {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    },
    // Flex row rather than the default inline flow, so the spacing is
    // a property of the container instead of a margin hung off
    // whichever button happens to be first.
    //
    // Only the LAST button carries edge="end". That prop applies a
    // -12px right margin to pull the icon flush with the container
    // edge — correct for the final button, and on any earlier one it
    // silently swallows most of this gap.
    actions: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

// iconFor picks an icon from the transport hints so the list is
// scannable without reading every label. Falls back to the fingerprint
// mark, which is the one people associate with passkeys generally.
const iconFor = (transports) => {
  const list = transports || [];
  if (list.indexOf('hybrid') > -1) {
    return <PhonelinkIcon />;
  }
  if (list.indexOf('usb') > -1 || list.indexOf('nfc') > -1) {
    return <UsbIcon />;
  }
  return <FingerprintIcon />;
};

const Credential = ({
  credential,
  disabled = false,
  handleRename,
  handleDelete,
}) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation('auth');
  const {
    nickname,
    transports,
    synced,
    cloneWarning,
    lastUsedAt,
    createdAt,
  } = credential;

  // moment formats relative time and dates in its own locale, which
  // defaults to en regardless of the i18n language. Scoping a clone to
  // the active language keeps "3 days ago" and the date format in step
  // with the surrounding copy instead of leaving two languages in one
  // line.
  const used = lastUsedAt ?
    t('webauthn.credential.lastUsed', {
      when: moment(lastUsedAt).locale(i18n.language).fromNow(),
    }) :
    t('webauthn.credential.neverUsed');
  const added = t('webauthn.credential.added', {
    date: moment(createdAt).locale(i18n.language).format('LL'),
  });

  return (
    <ListItem divider>
      <ListItemIcon>
        {iconFor(transports)}
      </ListItemIcon>
      <ListItemText
        primary={nickname}
        // component: 'div' because secondary holds Chips, which render
        // as block-level elements. Without it MUI wraps them in a <p>
        // and the markup is invalid.
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <>
            <Typography variant="caption" color="textSecondary">
              {`${used} · ${added}`}
            </Typography>
            <div className={classes.meta}>
              {/* Synced vs device-bound is the one piece of metadata
                  that changes what a person should do: a device-bound
                  passkey dies with the laptop. */}
              <Chip
                className={classes.chip}
                size="small"
                variant="outlined"
                label={synced ?
                  t('webauthn.credential.synced') :
                  t('webauthn.credential.deviceOnly')}
              />
            </div>
            {cloneWarning &&
              <div className={classes.warning}>
                <WarningIcon className={classes.warningIcon} />
                <Typography variant="caption" color="error">
                  {t('webauthn.credential.cloneWarning')}
                </Typography>
              </div>}
          </>
        }
      />
      <ListItemSecondaryAction className={classes.actions}>
        <Tooltip title={t('common:edit')}>
          {/* The span is load-bearing: a disabled MUI button fires no
              pointer events, so Tooltip never hears about the hover
              and the label becomes unreachable exactly when someone
              most wants to know why the control is dead. */}
          <span>
            <IconButton
              size="medium"
              disabled={disabled}
              aria-label={t('webauthn.credential.actions.rename', { name: nickname })}
              onClick={() => {
                return handleRename(credential);
              }}
            >
              <EditIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t('common:remove')}>
          <span>
            <IconButton
              edge="end"
              size="medium"
              disabled={disabled}
              aria-label={t('webauthn.credential.actions.remove', { name: nickname })}
              onClick={() => {
                return handleDelete(credential);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

Credential.propTypes = {
  credential: WebAuthnCredentialType.isRequired,
  disabled: PropTypes.bool,
  handleRename: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Credential;
