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
    marginTop: 10,
    width: '100%',
  },
});

const LoginForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    hasUsername,
    hasPassword,
    canSignup,
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
          {'Please Log In'}
        </Typography>
        <form className={classes.container} onSubmit={handleFormSubmit}>
          {error &&
            <Typography
              type="body1"
              color="error"
              paragraph
            >
              {error}
            </Typography>
          }
          <TextField
            name="username"
            onChange={handleFieldChange}
            label="Email or username"
            error={!hasUsername}
            helperText={!hasUsername ? 'Please enter your email or username.' : ''}
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
        </form>
      </Paper>
    </div>
  );
};

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  hasUsername: PropTypes.bool,
  hasPassword: PropTypes.bool,
  canSignup: PropTypes.bool,
  error: PropTypes.string,
};

LoginForm.defaultProps = {
  hasUsername: false,
  hasPassword: false,
  canSignup: false,
  error: '',
};

export default withStyles(styles)(LoginForm);
