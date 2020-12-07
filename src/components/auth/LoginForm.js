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
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <LoginIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              Please Log In
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="username"
            value={username.value}
            onChange={handleOnChange}
            label="Email or username"
            error={username.error !== ''}
            helperText={username.error}
            autoFocus
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: IDENTIFIER.MAX_LENGTH,
            }}
            required
          />
          <TextField
            type="password"
            name="password"
            value={password.value}
            onChange={handleOnChange}
            label="Password"
            error={password.error !== ''}
            helperText={password.error}
            fullWidth
            margin="normal"
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
            Login
          </Button>
        </CardActions>
        <CardActions>
          <Button
            href="/passwordreset/"
            fullWidth
          >
            Forgot password?
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
