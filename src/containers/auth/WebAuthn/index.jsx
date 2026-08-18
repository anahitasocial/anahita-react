/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';

import Credential from './Credential';
import RenameDialog from './RenameDialog';
import DeleteDialog from './DeleteDialog';
import api from '../../../api';

const useStyles = makeStyles((theme) => {
  return {
    alert: {
      marginBottom: theme.spacing(2),
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  };
});

// Mirrors constants.WebAuthnMaxCredentialsPerPerson on the Go side.
// Checked here only to disable the button with a useful message —
// the server enforces it regardless and returns 409.
const MAX_CREDENTIALS = 10;

// ceremonyErrorKey maps a DOMException from navigator.credentials to a
// translation key.
//
// Worth doing rather than surfacing err.message: the browser's own
// text is written for developers ("The operation either timed out or
// was not allowed"), reads as a system fault when the usual cause is
// that someone pressed Escape, and is never translated.
const ceremonyErrorKey = (error) => {
  if (!error) {
    return 'auth:webauthn.ceremonyErrors.generic';
  }

  if (error.name === 'InvalidStateError') {
    return 'auth:webauthn.ceremonyErrors.alreadyRegistered';
  }

  if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
    return 'auth:webauthn.ceremonyErrors.cancelled';
  }

  if (error.name === 'SecurityError') {
    return 'auth:webauthn.ceremonyErrors.insecureContext';
  }

  const status = error.response && error.response.status;

  if (status === 409) {
    return 'auth:webauthn.ceremonyErrors.atLimit';
  }

  if (status === 400) {
    return 'auth:webauthn.ceremonyErrors.expired';
  }

  return 'auth:webauthn.ceremonyErrors.generic';
};

const WebAuthn = () => {
  const classes = useStyles();
  const { t } = useTranslation(['common', 'auth']);

  const [credentials, setCredentials] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [supported] = useState(api.webauthn.isSupported());
  const [hasPlatform, setHasPlatform] = useState(false);

  const [renaming, setRenaming] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchCredentials = useCallback(() => {
    return api.webauthn.browse()
      .then((response) => {
        setCredentials(response.data.data || []);
        return response;
      })
      .catch((err) => {
        console.error(err);
        setError(t('auth:webauthn.alerts.browseError'));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [t]);

  useEffect(() => {
    if (!supported) {
      setIsFetching(false);
      return;
    }
    fetchCredentials();
    api.webauthn.hasPlatformAuthenticator().then(setHasPlatform);
  }, [supported, fetchCredentials]);

  // Starts the ceremony directly — no dialog first.
  //
  // Asking for a name up front was the original design and it was
  // wrong: the browser's picker offers things like "iCloud Keychain",
  // "Your Chrome Profile", and "Security Key", so the person cannot
  // know what they are naming until after they choose. The server
  // names it from the authenticator's own identifiers instead, and the
  // rename action on each row covers the rest.
  const handleAdd = () => {
    setIsBusy(true);
    setError('');
    setNotice('');

    api.webauthn.register()
      .then(() => {
        // Re-fetch rather than appending the /finish response: that
        // response bypasses the global axios interceptors, so its keys
        // are still snake_case and would not match the rest of the list.
        return fetchCredentials();
      })
      .then((response) => {
        // Name the passkey in the success message so the person can
        // tie what they just did to the row that appeared. Reading it
        // from the refreshed list rather than guessing means the
        // message always matches what is on screen.
        const list = (response && response.data && response.data.data) || [];
        const added = list.length > 0 ? list[0] : null;
        if (added) {
          setNotice(t('auth:webauthn.alerts.added', { name: added.nickname }));
        }
      })
      .catch((err) => {
        console.error(err);
        setError(t(ceremonyErrorKey(err)));
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  const handleRename = (nickname) => {
    const target = renaming;
    setIsBusy(true);
    setError('');

    api.webauthn.edit(target.id, nickname)
      .then(() => {
        setRenaming(null);
        return fetchCredentials();
      })
      .catch((err) => {
        console.error(err);
        setError(t('auth:webauthn.alerts.renameError'));
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  const handleDelete = () => {
    const target = deleting;
    setIsBusy(true);
    setError('');

    api.webauthn.deleteItem(target.id)
      .then(() => {
        setDeleting(null);
        setNotice(t('auth:webauthn.alerts.removed', { name: target.nickname }));
        return fetchCredentials();
      })
      .catch((err) => {
        console.error(err);
        setError(t('auth:webauthn.alerts.removeError'));
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  const atLimit = credentials.length >= MAX_CREDENTIALS;

  return (
    <Card>
      <CardHeader
        title={t('auth:webauthn.cTitle')}
        subheader={t('auth:webauthn.cDesc')}
      />

      {(isFetching || isBusy) &&
        <LinearProgress />}

      <CardContent>
        {error &&
          <Alert
            severity="error"
            className={classes.alert}
            onClose={() => {
              return setError('');
            }}
          >
            {error}
          </Alert>}

        {notice &&
          <Alert
            severity="success"
            className={classes.alert}
            onClose={() => {
              return setNotice('');
            }}
          >
            {notice}
          </Alert>}

        {!supported &&
          <Alert severity="info">
            {t('auth:webauthn.alerts.unsupported')}
          </Alert>}

        {atLimit &&
          <Alert severity="info" className={classes.alert}>
            {t('auth:webauthn.alerts.atLimit', { max: MAX_CREDENTIALS })}
          </Alert>}

        {supported && !isFetching && credentials.length === 0 &&
          <>
            <Typography variant="body2" color="textSecondary">
              {hasPlatform ?
                t('auth:webauthn.empty.platform') :
                t('auth:webauthn.empty.roaming')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('auth:webauthn.empty.fallback')}
            </Typography>
          </>}
      </CardContent>

      {supported && credentials.length > 0 &&
        <List className={classes.list} disablePadding>
          {credentials.map((credential) => {
            return (
              <Credential
                key={credential.id}
                credential={credential}
                disabled={isBusy}
                handleRename={setRenaming}
                handleDelete={setDeleting}
              />
            );
          })}
        </List>}

      {supported &&
        <CardActions>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            disabled={isBusy || isFetching || atLimit}
            onClick={handleAdd}
            fullWidth
            variant="outlined"
          >
            {isBusy ? t('auth:webauthn.adding') : t('auth:webauthn.add')}
          </Button>
        </CardActions>}

      <RenameDialog
        credential={renaming}
        isBusy={isBusy}
        handleConfirm={handleRename}
        handleCancel={() => {
          return setRenaming(null);
        }}
      />

      <DeleteDialog
        credential={deleting}
        isBusy={isBusy}
        handleConfirm={handleDelete}
        handleCancel={() => {
          return setDeleting(null);
        }}
      />
    </Card>
  );
};

export default WebAuthn;
