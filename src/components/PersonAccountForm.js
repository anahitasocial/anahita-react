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
    hasUsername,
    hasEmail,
    hasPassword,
    username,
    email,
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
            name="givenName"
            value={username || ''}
            onChange={handleFieldChange}
            label="Username"
            error={!hasUsername}
            helperText={!hasUsername ? 'Username is required!' : ''}
            margin="normal"
            autoFocus
            fullWidth
          />
          <TextField
            name="email"
            value={email || ''}
            onChange={handleFieldChange}
            label="Email"
            error={!hasEmail}
            helperText={!hasEmail ? 'Email is required!' : ''}
            margin="normal"
            fullWidth
          />
          <TextField
            name="password"
            type="password"
            onChange={handleFieldChange}
            label="Password"
            error={!hasPassword}
            helperText={!hasPassword ? 'Password is required!' : ''}
            margin="normal"
            fullWidth
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
            type="submit"
            variant="raised"
            color="primary"
            className={classes.button}
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
  hasEmail: PropTypes.bool,
  hasUsername: PropTypes.bool,
  hasPassword: PropTypes.bool,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  error: PropTypes.string,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  hasEmail: true,
  hasUsername: true,
  hasPassword: true,
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
