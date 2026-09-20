import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import api from '../../../api';
import i18n from '../../../languages';
import utils from '../../../utils';
import OAuthClientType from '../../../proptypes/OAuthClient';
import DEFAULT_CLIENT from '../../../proptypes/OAuthClientDefault';

const { form } = utils;

// The client_id slug, as the database CHECK constraint spells it. Kept
// on the input as a `pattern` so the browser refuses it before the
// round trip — a violation server-side is a bare 400 with nothing in
// the body to say which field was wrong.
const CLIENT_ID_PATTERN = '[a-z0-9][a-z0-9_-]{1,63}';

// Only ever a fallback, for when the discovery document cannot be read.
// Safe to hard-code because these three are fixed by a `oneof` tag on
// the request struct rather than by configuration — the list cannot
// vary between installations the way the scope catalog can.
const FALLBACK_GRANT_TYPES = [
  'authorization_code',
  'refresh_token',
  'client_credentials',
];

const TEXT_FIELDS = [
  'clientId',
  'name',
  'redirectUris',
  'tokenExpiry',
];

const useStyles = makeStyles((theme) => {
  return {
    field: {
      marginBottom: theme.spacing(2),
    },
    section: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(1),
    },
    chip: {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      cursor: 'pointer',
    },
    mono: {
      fontFamily: 'monospace',
    },
  };
});

// One URI per line is the friendliest shape for a list in a text area,
// and blank lines are what happen when somebody presses return twice.
// Dropped rather than sent, because the server validates every entry as
// a URL and an empty string is not one — which would fail the whole
// save over a stray newline.
const linesToList = (value) => {
  return value
    .split('\n')
    .map((line) => {
      return line.trim();
    })
    .filter(Boolean);
};

const clientToFieldValues = (client) => {
  const source = client || DEFAULT_CLIENT;

  return {
    clientId: source.clientId || '',
    name: source.name || '',
    redirectUris: (source.redirectUris || []).join('\n'),
    tokenExpiry: source.tokenExpiry || DEFAULT_CLIENT.tokenExpiry,
  };
};

const OAuthClientForm = ({
  open,
  client = null,
  onClose,
  onSave,
}) => {
  const classes = useStyles();
  const isEdit = Boolean(client);

  const [fields, setFields] = useState(() => {
    return form.createFormFields(TEXT_FIELDS, clientToFieldValues(client));
  });
  const [grantTypes, setGrantTypes] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [confidential, setConfidential] = useState(false);
  const [skipConsent, setSkipConsent] = useState(false);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // What the server says it supports, rather than a list maintained in
  // the browser. Both are validated on every save — grant types against
  // a `oneof` tag, scopes against the catalog in anahita-libs — so a
  // local copy can only drift, and the form this replaces had: it
  // offered a `password` grant auth-service has never accepted.
  const [supported, setSupported] = useState(null);

  useEffect(() => {
    if (!open || supported) {
      return undefined;
    }

    let cancelled = false;

    api.openidConfiguration.read()
      .then(({ data }) => {
        if (!cancelled) {
          setSupported({
            grantTypes: data.grantTypesSupported || FALLBACK_GRANT_TYPES,
            scopes: data.scopesSupported || [],
          });
        }
      })
      .catch(() => {
        // Degrade rather than block. Grant types are safe to assume;
        // the scope list is not, so it falls back to whatever this
        // client already holds. An edit then round-trips without
        // silently dropping scopes, and an add has nothing to offer —
        // correctly, since scopes are required and inventing them here
        // would just produce an invalid_scope from the server.
        if (!cancelled) {
          setSupported({
            grantTypes: FALLBACK_GRANT_TYPES,
            scopes: (client && client.scopes) || [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, supported, client]);

  // Re-seed every time the dialog opens, so editing one client and then
  // another does not show the first one's values.
  useEffect(() => {
    if (!open) {
      return;
    }

    setFields(form.createFormFields(TEXT_FIELDS, clientToFieldValues(client)));
    setGrantTypes((client && client.grantTypes) || []);
    setScopes((client && client.scopes) || []);
    setConfidential(Boolean(client && client.confidential));
    setSkipConsent(Boolean(client && client.skipConsent));
    setActive(client ? client.active !== false : DEFAULT_CLIENT.active);
  }, [open, client]);

  const toggle = (list, setList) => {
    return (value) => {
      setList(list.includes(value) ?
        list.filter((entry) => {
          return entry !== value;
        }) :
        [...list, value]);
    };
  };

  const toggleGrantType = toggle(grantTypes, setGrantTypes);
  const toggleScope = toggle(scopes, setScopes);

  // The server requires at least one of each, and says so with a bare
  // 400. Checked here so the refusal names the field.
  const grantTypesMissing = grantTypes.length === 0;
  const scopesMissing = scopes.length === 0;

  const handleChange = (event) => {
    const { target } = event;
    setFields((previous) => {
      return form.validateField(target, previous, ['clientId', 'name']);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validated = form.validateForm(event.target, fields);
    setFields(validated);

    if (!form.isValid(validated) || grantTypesMissing || scopesMissing) {
      return;
    }

    const values = form.fieldsToData(validated);

    setSubmitting(true);

    Promise.resolve(onSave({
      // Sent on add only. clientId is immutable, and the edit endpoint
      // ignores it — including it would look like a rename that did
      // nothing.
      ...(isEdit ? {} : { clientId: values.clientId.trim() }),
      name: values.name.trim(),
      redirectUris: linesToList(values.redirectUris),
      grantTypes,
      scopes,
      tokenExpiry: Number(values.tokenExpiry) || DEFAULT_CLIENT.tokenExpiry,
      confidential,
      skipConsent,
      active,
      // firstParty is not sent. The handler assigns it true on both add
      // and edit whatever the body says, so a control for it would be a
      // switch that does nothing.
    }))
      .catch(() => {
        // Already reported by the container, which keeps the dialog
        // open with the typed values intact.
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const availableScopes = useMemo(() => {
    const catalog = (supported && supported.scopes) || [];

    // A scope the client holds but the catalog no longer lists still
    // has to be visible — otherwise it disappears from the form and is
    // dropped by the next save without anybody being told.
    const extras = scopes.filter((scope) => {
      return !catalog.includes(scope);
    });

    return [...catalog, ...extras];
  }, [supported, scopes]);

  const availableGrantTypes = (supported && supported.grantTypes) || FALLBACK_GRANT_TYPES;

  const {
    clientId,
    name,
    redirectUris,
    tokenExpiry,
  } = fields;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {isEdit ?
            i18n.t('settings:oauthClients.form.editTitle') :
            i18n.t('settings:oauthClients.form.addTitle')}
        </DialogTitle>
        <DialogContent>
          {/* Immutable once set: rotating a client's identifier would
              orphan every authorization and token issued under it, so
              the server has no route for it. Shown, not offered. */}
          {isEdit ?
            <Box className={classes.field}>
              <Typography variant="caption" color="textSecondary" display="block">
                {i18n.t('settings:oauthClients.fields.clientId')}
              </Typography>
              <Typography className={classes.mono}>
                {client.clientId}
              </Typography>
            </Box> :
            <TextField
              className={classes.field}
              name="clientId"
              label={i18n.t('settings:oauthClients.fields.clientId')}
              value={clientId.value}
              onChange={handleChange}
              error={Boolean(clientId.error)}
              helperText={clientId.error || i18n.t('settings:oauthClients.form.clientIdHint')}
              fullWidth
              required
              inputProps={{
                minLength: 2,
                maxLength: 64,
                pattern: CLIENT_ID_PATTERN,
                autoCapitalize: 'none',
                autoCorrect: 'off',
                spellCheck: 'false',
              }}
            />}

          <TextField
            className={classes.field}
            name="name"
            label={i18n.t('settings:oauthClients.fields.name')}
            value={name.value}
            onChange={handleChange}
            error={Boolean(name.error)}
            helperText={name.error || i18n.t('settings:oauthClients.form.nameHint')}
            fullWidth
            required
            inputProps={{ minLength: 3, maxLength: 128 }}
          />

          <TextField
            className={classes.field}
            name="redirectUris"
            label={i18n.t('settings:oauthClients.fields.redirectUris')}
            value={redirectUris.value}
            onChange={handleChange}
            error={Boolean(redirectUris.error)}
            helperText={redirectUris.error || i18n.t('settings:oauthClients.form.redirectUrisHint')}
            fullWidth
            required
            multiline
            minRows={2}
          />

          <Typography variant="subtitle2" className={classes.section}>
            {i18n.t('settings:oauthClients.fields.grantTypes')}
          </Typography>
          <Box className={classes.chips}>
            {availableGrantTypes.map((grant) => {
              const selected = grantTypes.includes(grant);
              return (
                <Chip
                  key={grant}
                  label={grant}
                  className={classes.chip}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'default' : 'outlined'}
                  onClick={() => {
                    return toggleGrantType(grant);
                  }}
                />
              );
            })}
          </Box>
          {grantTypesMissing &&
            <Typography variant="caption" color="error" display="block" gutterBottom>
              {i18n.t('settings:oauthClients.form.grantTypesRequired')}
            </Typography>}

          <Typography variant="subtitle2" className={classes.section}>
            {i18n.t('settings:oauthClients.fields.scopes')}
          </Typography>
          <Box className={classes.chips}>
            {availableScopes.map((scope) => {
              const selected = scopes.includes(scope);
              return (
                <Chip
                  key={scope}
                  label={scope}
                  size="small"
                  className={classes.chip}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'default' : 'outlined'}
                  onClick={() => {
                    return toggleScope(scope);
                  }}
                />
              );
            })}
          </Box>
          {scopesMissing &&
            <Typography variant="caption" color="error" display="block" gutterBottom>
              {i18n.t('settings:oauthClients.form.scopesRequired')}
            </Typography>}
          {availableScopes.length === 0 &&
            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
              {i18n.t('settings:oauthClients.form.scopesUnavailable')}
            </Typography>}

          <TextField
            className={classes.field}
            name="tokenExpiry"
            label={i18n.t('settings:oauthClients.fields.tokenExpiry')}
            type="number"
            value={tokenExpiry.value}
            onChange={handleChange}
            error={Boolean(tokenExpiry.error)}
            helperText={tokenExpiry.error || i18n.t('settings:oauthClients.form.tokenExpiryHint')}
            fullWidth
            inputProps={{ min: 300, max: 86400 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={confidential}
                color="primary"
                onChange={(event) => {
                  setConfidential(event.target.checked);
                }}
              />
            }
            label={i18n.t('settings:oauthClients.fields.confidential')}
          />
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            {i18n.t('settings:oauthClients.form.confidentialHint')}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={skipConsent}
                color="primary"
                onChange={(event) => {
                  setSkipConsent(event.target.checked);
                }}
              />
            }
            label={i18n.t('settings:oauthClients.fields.skipConsent')}
          />
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            {i18n.t('settings:oauthClients.form.skipConsentHint')}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={active}
                color="primary"
                onChange={(event) => {
                  setActive(event.target.checked);
                }}
              />
            }
            label={i18n.t('settings:oauthClients.fields.active')}
          />
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} disabled={submitting}>
            {i18n.t('commons:dismiss')}
          </Button>
          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
            disabled={submitting}
          >
            {isEdit ?
              i18n.t('settings:oauthClients.actions.save') :
              i18n.t('settings:oauthClients.actions.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

OAuthClientForm.propTypes = {
  open: PropTypes.bool.isRequired,
  client: OAuthClientType,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default OAuthClientForm;
