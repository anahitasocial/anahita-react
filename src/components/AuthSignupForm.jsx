import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import SignUpIcon from '@material-ui/icons/PersonAdd';

import { Signup as SIGNUP } from '../constants';
import i18n from '../languages';

const AuthSignupForm = ({
  handleOnChange,
  handleOnBlur,
  handleOnSubmit,
  fields: {
    name,
    username,
    email,
    password,
    // eslint-disable-next-line camelcase
    tos_accepted: tosAccepted,
    // eslint-disable-next-line camelcase
    pp_accepted: ppAccepted,
  },
  agreements,
  isFetching,
  success,
}) => {
  const {
    NAME,
    USERNAME,
    EMAIL,
    PASSWORD,
  } = SIGNUP.FIELDS;

  // The agreement versions have to be in hand before anything can be
  // submitted: an acceptance that cannot say which text it accepted is
  // refused by the server, so submitting without them would only produce a
  // confusing 409.
  const canSubmit = name.isValid &&
  username.isValid &&
  email.isValid &&
  password.isValid &&
  tosAccepted.value === true &&
  ppAccepted.value === true &&
  Boolean(agreements.tos.version) &&
  Boolean(agreements.privacy.version);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <SignUpIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {i18n.t('auth:signup.cTitle')}
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="name"
            value={name.value}
            onChange={handleOnChange}
            label={i18n.t('auth:signup.displayName')}
            error={name.error !== ''}
            helperText={name.error}
            autoFocus
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: NAME.MAX_LENGTH,
              minLength: NAME.MIN_LENGTH,
            }}
            required
          />
          <TextField
            name="username"
            value={username.value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            label={i18n.t('auth:signup.username')}
            error={username.error !== ''}
            helperText={username.error}
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: USERNAME.MAX_LENGTH,
              minLength: USERNAME.MIN_LENGTH,
            }}
            required
          />
          <TextField
            type="email"
            name="email"
            value={email.value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            label={i18n.t('auth:signup.email')}
            error={email.error !== ''}
            helperText={email.error}
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: EMAIL.MAX_LENGTH,
              minLength: EMAIL.MIN_LENGTH,
            }}
            required
          />
          <TextField
            type="password"
            name="password"
            value={password.value}
            onChange={handleOnChange}
            label={i18n.t('auth:signup.password')}
            error={password.error !== ''}
            helperText={password.error}
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: PASSWORD.MAX_LENGTH,
              minLength: PASSWORD.MIN_LENGTH,
            }}
            required
          />
          <Typography variant="caption" color="textSecondary">
            {i18n.t('auth:signup.passwordHelp')}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                name="tos_accepted"
                checked={tosAccepted.value === true}
                onChange={handleOnChange}
                color="primary"
                disabled={success}
                required
              />
            }
            label={
              <Typography variant="body2">
                <Trans i18nKey="auth:signup.tos">
                  <Link
                    href={agreements.tos.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>
                </Trans>
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="pp_accepted"
                checked={ppAccepted.value === true}
                onChange={handleOnChange}
                color="primary"
                disabled={success}
                required
              />
            }
            label={
              <Typography variant="body2">
                <Trans i18nKey="auth:signup.privacy">
                  <Link
                    href={agreements.privacy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </Trans>
              </Typography>
            }
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={success || isFetching || !canSubmit}
            fullWidth
          >
            {i18n.t('auth:signup.actions.signup')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

AuthSignupForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  agreements: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
};

export default AuthSignupForm;
