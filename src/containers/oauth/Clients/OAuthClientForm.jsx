import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import OAuthClientDefault from '../../../proptypes/OAuthClientDefault';
import utils from '../../../utils';

const { form } = utils;

const GRANT_TYPE_OPTIONS = [
  'authorization_code',
  'refresh_token',
  'client_credentials',
  'password',
];

const FORM_FIELD_NAMES = [
  'name',
  'redirectUris',
  'scopes',
  'tokenExpiry',
];

const useStyles = makeStyles((theme) => {
  return {
    field: {
      marginBottom: theme.spacing(2),
    },
    sectionLabel: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    chipRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    chip: {
      cursor: 'pointer',
    },
    clientIdBox: {
      marginBottom: theme.spacing(2),
    },
    clientIdValue: {
      fontFamily: 'monospace',
      fontSize: '0.9rem',
    },
  };
});

// Turn a client (or the default) into the shape our form needs
const clientToDefaults = (client) => {
  const source = client || OAuthClientDefault;
  return {
    name: source.name || '',
    redirectUris: (source.redirectUris || []).join('\n'),
    scopes: (source.scopes || []).join('\n'),
    tokenExpiry: source.tokenExpiry || 900,
  };
};

// Turn form values back into an API-shaped payload
const formToClientData = (fieldValues, extras) => {
  return {
    name: fieldValues.name.trim(),
    redirectUris: fieldValues.redirectUris
      .split('\n')
      .map((s) => { return s.trim(); })
      .filter(Boolean),
    scopes: fieldValues.scopes
      .split('\n')
      .map((s) => { return s.trim(); })
      .filter(Boolean),
    tokenExpiry: Number(fieldValues.tokenExpiry) || 900,
    grantTypes: extras.grantTypes,
    confidential: extras.confidential,
    active: extras.active,
  };
};

const OAuthClientForm = ({
  open,
  client,
  onClose,
  onSave,
}) => {
  const classes = useStyles();
  const isEdit = Boolean(client);

  const initialFields = useMemo(() => {
    return form.createFormFields(FORM_FIELD_NAMES, clientToDefaults(client));
  }, [client]);

  const [fields, setFields] = useState(initialFields);
  const [grantTypes, setGrantTypes] = useState((client && client.grantTypes) || []);
  const [confidential, setConfidential] = useState(Boolean(client && client.confidential));
  const [active, setActive] = useState(client ? client.active !== false : true);
  const [submitting, setSubmitting] = useState(false);

  // Re-seed state whenever the dialog opens with a different client
  useEffect(() => {
    if (open) {
      const defaults = clientToDefaults(client);
      setFields(form.createFormFields(FORM_FIELD_NAMES, defaults));
      setGrantTypes((client && client.grantTypes) || []);
      setConfidential(Boolean(client && client.confidential));
      setActive(client ? client.active !== false : true);
    }
  }, [open, client]);

  const handleOnChange = (event) => {
    const { target } = event;
    setFields((prev) => { return form.validateField(target, prev, ['name']); });
  };

  const toggleGrantType = (grant) => {
    setGrantTypes((prev) => {
      return prev.includes(grant)
        ? prev.filter((g) => { return g !== grant; })
        : [...prev, grant];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { target } = event;
    const newFields = form.validateForm(target, fields);
    setFields(newFields);

    if (!form.isValid(newFields) || grantTypes.length === 0) {
      return;
    }

    const fieldValues = form.fieldsToData(newFields);
    const payload = formToClientData(fieldValues, {
      grantTypes,
      confidential,
      active,
    });

    setSubmitting(true);
    try {
      await onSave(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const {
    name,
    redirectUris,
    scopes,
    tokenExpiry,
  } = fields;

  const grantTypesError = grantTypes.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {isEdit ? 'Edit OAuth Client' : 'Add OAuth Client'}
        </DialogTitle>
        <DialogContent>
          {isEdit && client && (
            <Box className={classes.clientIdBox}>
              <Typography variant="caption" color="textSecondary" display="block">
                Client ID
              </Typography>
              <Typography className={classes.clientIdValue}>
                {client.clientId}
              </Typography>
            </Box>
          )}

          <TextField
            className={classes.field}
            name="name"
            label="Name"
            value={name.value}
            onChange={handleOnChange}
            error={Boolean(name.error)}
            helperText={name.error || (isEdit ? '' : 'The client ID will be generated from the name')}
            fullWidth
            required
            inputProps={{ minLength: 3, maxLength: 128 }}
          />

          <TextField
            className={classes.field}
            name="redirectUris"
            label="Redirect URIs"
            value={redirectUris.value}
            onChange={handleOnChange}
            error={Boolean(redirectUris.error)}
            helperText={redirectUris.error || 'One per line'}
            fullWidth
            multiline
            minRows={2}
            required
          />

          <Typography variant="subtitle2" className={classes.sectionLabel}>
            Grant Types
          </Typography>
          <Box className={classes.chipRow}>
            {GRANT_TYPE_OPTIONS.map((grant) => {
              const selected = grantTypes.includes(grant);
              return (
                <Chip
                  key={grant}
                  label={grant}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'default' : 'outlined'}
                  onClick={() => { return toggleGrantType(grant); }}
                  className={classes.chip}
                />
              );
            })}
          </Box>
          {grantTypesError && (
            <Typography variant="caption" color="error" display="block" style={{ marginTop: -8, marginBottom: 16 }}>
              Select at least one grant type
            </Typography>
          )}

          <TextField
            className={classes.field}
            name="scopes"
            label="Scopes"
            value={scopes.value}
            onChange={handleOnChange}
            error={Boolean(scopes.error)}
            helperText={scopes.error || 'One per line, e.g. openid, profile, read:actors'}
            fullWidth
            multiline
            minRows={3}
            required
          />

          <TextField
            className={classes.field}
            name="tokenExpiry"
            label="Token Expiry (seconds)"
            type="number"
            value={tokenExpiry.value}
            onChange={handleOnChange}
            error={Boolean(tokenExpiry.error)}
            helperText={tokenExpiry.error}
            fullWidth
            inputProps={{ min: 300, max: 86400 }}
          />

          <FormControlLabel
            control={(
              <Switch
                checked={confidential}
                onChange={(e) => { return setConfidential(e.target.checked); }}
                color="primary"
              />
            )}
            label="Confidential"
          />
          <FormControlLabel
            control={(
              <Switch
                checked={active}
                onChange={(e) => { return setActive(e.target.checked); }}
                color="primary"
              />
            )}
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
            disabled={submitting}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

OAuthClientForm.propTypes = {
  open: PropTypes.bool.isRequired,
  client: PropTypes.shape({
    id: PropTypes.number,
    clientId: PropTypes.string,
    name: PropTypes.string,
    redirectUris: PropTypes.arrayOf(PropTypes.string),
    grantTypes: PropTypes.arrayOf(PropTypes.string),
    scopes: PropTypes.arrayOf(PropTypes.string),
    tokenExpiry: PropTypes.number,
    confidential: PropTypes.bool,
    active: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

OAuthClientForm.defaultProps = {
  client: null,
};

export default OAuthClientForm;
