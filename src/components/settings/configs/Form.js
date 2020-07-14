/* eslint camelcase: "off" */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import ConfigsType from '../../../proptypes/settings/Configs';

const MAX_LENGTH = 100;

const SettingsConfigsForm = (props) => {
  const {
    configs,
    handleOnChange,
    handleOnSubmit,
    fields: {
      sitename,
      live_site,
      log_path,
      tmp_path,
      host,
      db,
      dbprefix,
      smtpport,
      smtpuser,
      smtppass,
      smtphost,
    },
    isFetching,
  } = props;

  const enableSubmit = true; // sitename.isValid && live_site.isValid;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
          >
            Configs
          </Typography>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
          >
            <FormLabel component="legend">
              Server
            </FormLabel>
            <TextField
              name="sitename"
              value={configs.sitename}
              onChange={handleOnChange}
              label="Site Name"
              error={sitename.error !== ''}
              helperText={sitename.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="live_site"
              value={configs.live_site}
              onChange={handleOnChange}
              label="Live Site"
              error={live_site.error !== ''}
              helperText={live_site.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="log_path"
              value={configs.log_path}
              onChange={handleOnChange}
              label="Path to log folder"
              error={log_path.error !== ''}
              helperText={log_path.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="tmp_path"
              value={configs.tmp_path}
              onChange={handleOnChange}
              label="Path to temp folder"
              error={tmp_path.error !== ''}
              helperText={tmp_path.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="secret"
              value={configs.secret}
              label="Secret Word"
              margin="normal"
              fullWidth
              disabled
            />
            <FormControl margin="normal">
              <InputLabel id="configs-error-reporting-label">
                Error Reporting
              </InputLabel>
              <Select
                id="configs-error-reporting"
                labelId="configs-error-reporting-label"
                name="error_reporting"
                value={configs.error_reporting}
                onChange={handleOnChange}
                label="Error Reporting"
              >
                <MenuItem value={-1}>System Default</MenuItem>
                <MenuItem value={0}>None</MenuItem>
                <MenuItem value={7}>Simple</MenuItem>
                <MenuItem value={30719}>Maximum</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={configs.sef_rewrite}
                  onChange={handleOnChange}
                  name="sef_rewrite"
                />
              }
              label="Use mod_rewrite"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configs.debug}
                  onChange={handleOnChange}
                  name="debug"
                />
              }
              label="Debug System"
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
          >
            <FormLabel component="legend">
              Database Settings
            </FormLabel>
            <TextField
              name="dbtype"
              value={configs.dbtype}
              label="Database Type"
              margin="normal"
              fullWidth
              disabled
            />
            <TextField
              name="host"
              value={configs.host}
              onChange={handleOnChange}
              label="Database Host"
              error={host.error !== ''}
              helperText={host.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="db"
              value={configs.db}
              onChange={handleOnChange}
              label="Database Type"
              error={db.error !== ''}
              helperText={db.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="dbprefix"
              value={configs.dbprefix}
              onChange={handleOnChange}
              label="Database Prefix"
              error={dbprefix.error !== ''}
              helperText={dbprefix.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
          >
            <FormLabel component="legend">
              Mail Settings
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={configs.smtpauth}
                  onChange={handleOnChange}
                  name="smtpauth"
                />
              }
              label="SMTP Auth"
            />
            <FormControl margin="normal">
              <InputLabel id="configs-smtp-security-label">
                SMTP Security
              </InputLabel>
              <Select
                id="configs-smtp-security"
                labelId="configs-smtp-security-label"
                name="smtpsecure"
                value={configs.smtpsecure}
                onChange={handleOnChange}
                label="SMTP Security"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="ssl">SSL</MenuItem>
                <MenuItem value="tls">TLS</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="smtpport"
              type="number"
              value={configs.smtpport}
              onChange={handleOnChange}
              label="SMTP Port"
              error={smtpport.error !== ''}
              helperText={smtpport.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="smtpuser"
              value={configs.smtpuser}
              onChange={handleOnChange}
              label="SMTP User"
              error={smtpuser.error !== ''}
              helperText={smtpuser.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="smtppass"
              type="password"
              value={configs.smtppass}
              onChange={handleOnChange}
              label="SMTP Password"
              error={smtppass.error !== ''}
              helperText={smtppass.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="smtphost"
              value={configs.smtphost}
              onChange={handleOnChange}
              label="SMTP Host"
              error={smtphost.error !== ''}
              helperText={smtphost.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching || !enableSubmit}
            fullWidth
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

SettingsConfigsForm.propTypes = {
  configs: ConfigsType.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default SettingsConfigsForm;
