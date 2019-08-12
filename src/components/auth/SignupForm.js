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

const SignupForm = (props) => {
  const {
    handleFieldChange,
    handleFormSubmit,
    givenName,
    givenNameError,
    givenNameHelperText,
    familyName,
    familyNameError,
    familyNameHelperText,
    username,
    usernameError,
    usernameHelperText,
    email,
    emailError,
    emailHelperText,
    password,
    passwordError,
    passwordHelperText,
    isFetching,
    canSubmit,
  } = props;

  return (
    <form onSubmit={handleFormSubmit} autoComplete="off">
      <Card square>
        <CardHeader
          avatar={
            <Avatar>
              <SignUpIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {'Please Sign Up'}
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="givenName"
            value={givenName}
            onChange={handleFieldChange}
            label="First Name"
            error={givenNameError}
            helperText={givenNameHelperText}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            name="familyName"
            value={familyName}
            onChange={handleFieldChange}
            label="Last Name"
            error={familyNameError}
            helperText={familyNameHelperText}
            fullWidth
            margin="normal"
          />
          <TextField
            name="username"
            value={username}
            onChange={handleFieldChange}
            label="Username"
            error={usernameError}
            helperText={usernameHelperText}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            value={email}
            onChange={handleFieldChange}
            label="Email"
            error={emailError}
            helperText={emailHelperText}
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
            variant="contained"
            type="submit"
            color="primary"
            disabled={isFetching || !canSubmit}
            fullWidth
          >
            {'Signup'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

SignupForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  givenName: PropTypes.string,
  givenNameError: PropTypes.bool.isRequired,
  givenNameHelperText: PropTypes.string,
  familyName: PropTypes.string,
  familyNameError: PropTypes.bool.isRequired,
  familyNameHelperText: PropTypes.string,
  username: PropTypes.string,
  usernameError: PropTypes.bool.isRequired,
  usernameHelperText: PropTypes.string,
  email: PropTypes.string,
  emailError: PropTypes.bool.isRequired,
  emailHelperText: PropTypes.string,
  password: PropTypes.string,
  passwordError: PropTypes.bool.isRequired,
  passwordHelperText: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  canSubmit: PropTypes.bool.isRequired,
};

SignupForm.defaultProps = {
  givenName: '',
  givenNameHelperText: '',
  familyName: '',
  familyNameHelperText: '',
  username: '',
  usernameHelperText: '',
  email: '',
  emailHelperText: '',
  password: '',
  passwordHelperText: '',
};

export default SignupForm;
