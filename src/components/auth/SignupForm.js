import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import SignUpIcon from '@material-ui/icons/PersonAdd';

import { Signup as SIGNUP } from '../../constants';
import i18n from '../../languages';

const SignupForm = (props) => {
  const {
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    fields: {
      givenName,
      familyName,
      username,
      email,
      password,
    },
    isFetching,
    success,
  } = props;

  const {
    GIVEN_NAME,
    FAMILY_NAME,
    USERNAME,
    EMAIL,
    PASSWORD,
  } = SIGNUP.FIELDS;

  const canSubmit = givenName.isValid &&
  familyName.isValid &&
  username.isValid &&
  email.isValid &&
  password.isValid;

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
            name="givenName"
            value={givenName.value}
            onChange={handleOnChange}
            label={i18n.t('auth:signup.firstName')}
            error={givenName.error !== ''}
            helperText={givenName.error}
            autoFocus
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: GIVEN_NAME.MAX_LENGTH,
              minLength: GIVEN_NAME.MIN_LENGTH,
            }}
            required
          />
          <TextField
            name="familyName"
            value={familyName.value}
            onChange={handleOnChange}
            label={i18n.t('auth:signup.lastName')}
            error={familyName.error !== ''}
            helperText={familyName.error}
            fullWidth
            margin="normal"
            disabled={success}
            inputProps={{
              maxLength: FAMILY_NAME.MAX_LENGTH,
              minLength: FAMILY_NAME.MIN_LENGTH,
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

SignupForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
};

export default SignupForm;
