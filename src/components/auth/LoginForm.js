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

import LoginIcon from '@material-ui/icons/Person';

import { Auth as AUTH } from '../../constants';
import i18n from '../../languages';

const LoginForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      username,
      password,
    },
    isFetching,
  } = props;

  const { IDENTIFIER, PASSWORD } = AUTH.FIELDS;

  const enableSubmit = username.isValid && password.isValid;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <LoginIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {i18n.t('auth:login')}
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="username"
            value={username.value}
            onChange={handleOnChange}
            label={i18n.t('auth:username')}
            error={username.error !== ''}
            helperText={username.error}
            autoFocus
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: IDENTIFIER.MAX_LENGTH,
            }}
            autoComplete="username"
            required
          />
          <TextField
            type="password"
            name="password"
            value={password.value}
            onChange={handleOnChange}
            label={i18n.t('auth:password')}
            error={password.error !== ''}
            helperText={password.error}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            inputProps={{
              maxLength: PASSWORD.MAX_LENGTH,
            }}
            required
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching || !enableSubmit}
            fullWidth
          >
            {i18n.t('actions:login')}
          </Button>
        </CardActions>
        <CardActions>
          <Button
            href="/passwordreset/"
            fullWidth
          >
            {i18n.t('auth:forgotPassword')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

LoginForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default LoginForm;
