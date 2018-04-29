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
  },
  formPaper: {
    padding: '20px',
  },
  button: {
    marginTop: 10,
    marginRight: 10,
  },
});

const ActorInfoForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    username,
    usernameHelperText,
    usernameError,
    email,
    emailHelperText,
    emailError,
    password,
    passwordError,
    passwordHelperText,
    isFetching,
    error,
    dismissPath,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={0}>
        <Typography variant="title" color="primary">
          {'Account Information'}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              variant="caption"
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
          <TextField
            name="username"
            value={username}
            onChange={handleFieldChange}
            label="Username"
            error={usernameError}
            helperText={usernameHelperText}
            autoFocus
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
          {dismissPath &&
          <Button
            className={classes.button}
            component={Link}
            to={dismissPath}
          >
            {'Dismiss'}
          </Button>
          }
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={classes.button}
            disabled={isFetching}
          >
            {'Save'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

ActorInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  username: PropTypes.string,
  usernameHelperText: PropTypes.string,
  usernameError: PropTypes.bool.isRequired,
  email: PropTypes.string,
  emailHelperText: PropTypes.string,
  emailError: PropTypes.bool.isRequired,
  password: PropTypes.string,
  passwordHelperText: PropTypes.string,
  passwordError: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  username: '',
  usernameHelperText: '',
  email: '',
  emailHelperText: '',
  password: '',
  passwordHelperText: '',
  isFetching: false,
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
