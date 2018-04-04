import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

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
    hasGivenName,
    hasFamilyName,
    hasUsername,
    hasEmail,
    hasPassword,
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
            {error}
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
            onChange={handleFieldChange}
            label="First Name"
            error={!hasGivenName}
            helperText={!hasGivenName ? 'First name is required!' : ''}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            name="familyName"
            onChange={handleFieldChange}
            label="Last Name"
            error={!hasFamilyName}
            helperText={!hasFamilyName ? 'Last name is required!' : ''}
            fullWidth
            margin="normal"
          />
          <TextField
            name="username"
            onChange={handleFieldChange}
            label="Username"
            error={!hasUsername}
            helperText={!hasUsername ? 'Username is required!' : ''}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            onChange={handleFieldChange}
            label="Email"
            error={!hasEmail}
            helperText={!hasEmail ? 'Email is required!' : ''}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            name="password"
            onChange={handleFieldChange}
            label="Password"
            error={!hasPassword}
            helperText={!hasPassword ? 'Please enter your password.' : ''}
            fullWidth
            margin="normal"
          />
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={classes.button}
          >
            Signup
          </Button>
          <Button
            component={Link}
            to="/login/"
            className={classes.button}
          >
            Login
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
  hasGivenName: PropTypes.bool,
  hasFamilyName: PropTypes.bool,
  hasUsername: PropTypes.bool,
  hasEmail: PropTypes.bool,
  hasPassword: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.string,
};

SignupForm.defaultProps = {
  hasGivenName: true,
  hasFamilyName: true,
  hasUsername: true,
  hasEmail: true,
  hasPassword: true,
  success: false,
  error: '',
};

export default withStyles(styles)(SignupForm);
