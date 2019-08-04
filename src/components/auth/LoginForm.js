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

const LoginForm = (props) => {
  const {
    handleFieldChange,
    handleLogin,
    username,
    usernameError,
    usernameHelperText,
    password,
    passwordError,
    passwordHelperText,
    isFetching,
  } = props;

  return (
    <form onSubmit={handleLogin}>
      <Card square>
        <CardHeader
          avatar={
            <Avatar>
              <LoginIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {'Please Log In'}
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="username"
            value={username}
            onChange={handleFieldChange}
            label="Email or username"
            error={usernameError}
            helperText={usernameHelperText}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            name="password"
            value={password}
            onChange={handleFieldChange}
            label="Password"
            error={passwordError}
            helperText={passwordHelperText}
            fullWidth
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching}
            fullWidth
          >
            {'Login'}
          </Button>
        </CardActions>
        <CardActions>
          <Button
            href="/passwordreset/"
            fullWidth
          >
            {'Forgot password?'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

LoginForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string,
  usernameError: PropTypes.bool,
  usernameHelperText: PropTypes.string,
  password: PropTypes.string,
  passwordError: PropTypes.bool,
  passwordHelperText: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

LoginForm.defaultProps = {
  username: '',
  usernameError: false,
  usernameHelperText: '',
  password: '',
  passwordError: false,
  passwordHelperText: '',
};

export default LoginForm;
