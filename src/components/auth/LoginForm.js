import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from 'react-router-dom/Link';

const styles = (theme) => {
  return {
    formPaper: {
      padding: theme.spacing(2),
      maxWidth: '360px',
      margin: '64px auto',
    },
    title: {
      marginBottom: theme.spacing(),
    },
    button: {
      marginTop: theme.spacing(),
      width: '100%',
    },
  };
};

const LoginForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    username,
    usernameError,
    usernameHelperText,
    password,
    passwordError,
    passwordHelperText,
    canSignup,
    isFetching,
  } = props;

  return (
    <Paper className={classes.formPaper} square>
      <Typography
        variant="h6"
        color="primary"
        className={classes.title}
      >
        {'Please Log In'}
      </Typography>
      <form
        className={classes.container}
        onSubmit={handleFormSubmit}
      >
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
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
          disabled={isFetching}
        >
          {'Login'}
        </Button>
        {canSignup &&
          <Button
            component={Link}
            to="/signup/"
            className={classes.button}
          >
            {'Signup'}
          </Button>
        }
        <Button
          component={Link}
          to="/passwordreset/"
          className={classes.button}
        >
          {'Forgot Password?'}
        </Button>
      </form>
    </Paper>
  );
};

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  username: PropTypes.string,
  usernameError: PropTypes.bool,
  usernameHelperText: PropTypes.string,
  password: PropTypes.string,
  passwordError: PropTypes.bool,
  passwordHelperText: PropTypes.string,
  canSignup: PropTypes.bool,
  isFetching: PropTypes.bool,
};

LoginForm.defaultProps = {
  username: '',
  usernameError: false,
  usernameHelperText: '',
  password: '',
  passwordError: false,
  passwordHelperText: '',
  canSignup: false,
  isFetching: false,
};

export default withStyles(styles)(LoginForm);
