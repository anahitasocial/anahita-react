import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

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
  colorError: {
    color: theme.palette.error.A400,
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
    error,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={2}>
        <Typography type="headline" color="primary">
            Please login
        </Typography>
        <form className={classes.container} onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              type="body1"
              classes={classes.colorError}
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
          <TextField
            name="username"
            onChange={handleFieldChange('username')}
            label="Email or username"
            error={!hasUsername}
            helperText={!hasUsername ? 'Please enter your email or username.' : ''}
            margin="normal"
            autoFocus
            fullWidth
          />
          <TextField
            type="password"
            name="password"
            onChange={handleFieldChange('password')}
            label="Password"
            error={!hasPassword}
            helperText={!hasPassword ? 'Please enter your password.' : ''}
            margin="normal"
            fullWidth
          />
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={classes.button}
          >
            Login
          </Button>
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
  error: PropTypes.string,
};

LoginForm.defaultProps = {
  hasUsername: false,
  hasPassword: false,
  error: '',
};

export default withStyles(styles)(LoginForm);
