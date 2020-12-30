/* eslint camelcase: "off" */
import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import ConfigsIcon from '@material-ui/icons/Settings';

import ConfigsType from '../../../proptypes/settings/Configs';

const MAX_LENGTH = 100;

const SettingsConfigsForm = (props) => {
  const {
    configs,
    handleOnChange,
    handleOnSubmit,
    fields: {
      sitename,
      // Mailer Settings
      mailfrom,
      fromname,
      sendmail,
      // SMTP Settings
      smtp_user,
      smtp_pass,
      smtp_host,
      smtp_port,
    },
    isFetching,
  } = props;

  const isSMTP = configs.mailer === 'smtp';

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card variant="outlined">
        <CardHeader
          title={
            <Typography variant="h4">Configs</Typography>
          }
          avatar={
            <Avatar>
              <ConfigsIcon />
            </Avatar>
          }
        />
        <CardContent>
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
              name="server_domain"
              value={configs.server_domain}
              label="Server Domain"
              margin="normal"
              fullWidth
              disabled
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
          >
            <FormLabel component="legend">
              Mailer Settings
            </FormLabel>
            <Select
              id="configs-mailer"
              labelId="configs-mailer-label"
              name="mailer"
              value={configs.mailer}
              onChange={handleOnChange}
              label="Mailer"
            >
              <MenuItem value="mail">Mail</MenuItem>
              <MenuItem value="sendmail">Sendmail</MenuItem>
              <MenuItem value="smtp">SMTP</MenuItem>
            </Select>
            <TextField
              name="mailfrom"
              value={configs.mailfrom}
              onChange={handleOnChange}
              label="Mail From"
              error={mailfrom.error !== ''}
              helperText={mailfrom.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="fromname"
              value={configs.mailfrom}
              onChange={handleOnChange}
              label="From Name"
              error={fromname.error !== ''}
              helperText={fromname.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required
            />
            <TextField
              name="sendmail"
              value={configs.sendmail}
              onChange={handleOnChange}
              label="Send Mail"
              error={sendmail.error !== ''}
              helperText={sendmail.error}
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
              SMTP Settings
            </FormLabel>
            <FormControl margin="normal">
              <InputLabel id="configs-smtp-security-label">
                SMTP Security
              </InputLabel>
              <Select
                id="configs-smtp-security"
                labelId="configs-smtp-security-label"
                name="smtp_secure"
                value={configs.smtp_secure}
                onChange={handleOnChange}
                label="SMTP Security"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="ssl">SSL</MenuItem>
                <MenuItem value="tls">TLS</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="smtp_port"
              type="number"
              value={configs.smtp_port}
              onChange={handleOnChange}
              label="SMTP Port"
              error={smtp_port.error !== ''}
              helperText={smtp_port.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required={isSMTP}
            />
            <TextField
              name="smtp_user"
              value={configs.smtp_user}
              onChange={handleOnChange}
              label="SMTP User"
              error={smtp_user.error !== ''}
              helperText={smtp_user.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required={isSMTP}
            />
            <TextField
              name="smtp_pass"
              type="password"
              value={configs.smtp_pass}
              onChange={handleOnChange}
              label="SMTP Password"
              error={smtp_pass.error !== ''}
              helperText={smtp_pass.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required={isSMTP}
            />
            <TextField
              name="smtp_host"
              value={configs.smtp_host}
              onChange={handleOnChange}
              label="SMTP Host"
              error={smtp_host.error !== ''}
              helperText={smtp_host.error}
              margin="normal"
              fullWidth
              inputProps={{
                maxLength: MAX_LENGTH,
              }}
              required={isSMTP}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching}
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
