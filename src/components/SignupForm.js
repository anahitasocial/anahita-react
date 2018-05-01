import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import TextFieldUsername from './textfields/TextFieldUsername';
import TextFieldEmail from './textfields/TextFieldEmail';


const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  formPaper: {
    padding: '20px',
    maxWidth: '360px',
    margin: '64px auto',
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
});

const SignupForm = (props) => {
  const {
    classes,
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
    success,
    error,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={2}>
        <Typography
          variant="title"
          color="primary"
          className={classes.title}
        >
          {'Please Sign Up'}
        </Typography>
        {error &&
          <Typography
            variant="body1"
            color="error"
            paragraph
          >
            {'Something went wrong!'}
          </Typography>
        }
        {success &&
          <Typography
            variant="body1"
            color="primary"
            paragraph
          >
            {'Thank you! We just emailed you an account activation link. Please click on it and log on to your account'}
          </Typography>
        }
        <form onSubmit={handleFormSubmit}>
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
            disabled={success}
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
            disabled={success}
          />
          <TextFieldUsername
            value={username}
            onChange={handleFieldChange}
            error={usernameError}
            helperText={usernameHelperText}
            disabled={success}
          />
          <TextFieldEmail
            value={email}
            onChange={handleFieldChange}
            disabled={success}
            error={emailError}
            helperText={emailHelperText}
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
            disabled={success}
          />
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={classes.button}
            disabled={isFetching || success}
          >
            {'Signup'}
          </Button>
          <Button
            component={Link}
            to="/login/"
            className={classes.button}
          >
            {'Login'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

SignupForm.propTypes = {
  classes: PropTypes.object.isRequired,
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
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.string,
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
  isFetching: false,
  success: false,
  error: '',
};

export default withStyles(styles)(SignupForm);
