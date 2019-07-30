import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import TextFieldUsername from '../textfields/TextFieldUsername';
import TextFieldEmail from '../textfields/TextFieldEmail';

const styles = (theme) => {
  return {
    formPaper: {
      padding: theme.spacing(2),
    },
    formControl: {
      marginTop: theme.spacing(3),
      display: 'block',
    },
    button: {
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
  };
};

const PersonAccountForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleEdit,
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
    dismissPath,
  } = props;

  return (
    <Paper className={classes.formPaper} elevation={0}>
      <Typography variant="h6" color="primary">
        {'Account Information'}
      </Typography>
      <TextFieldUsername
        value={username}
        onChange={handleFieldChange}
        error={usernameError}
        helperText={usernameHelperText}
      />
      <TextFieldEmail
        value={email}
        onChange={handleFieldChange}
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
        variant="contained"
        type="submit"
        color="primary"
        className={classes.button}
        disabled={isFetching}
        onClick={handleEdit}
      >
        {'Save'}
      </Button>
    </Paper>
  );
};

PersonAccountForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  username: PropTypes.string,
  usernameHelperText: PropTypes.string,
  usernameError: PropTypes.bool,
  email: PropTypes.string,
  emailHelperText: PropTypes.string,
  emailError: PropTypes.bool,
  password: PropTypes.string,
  passwordHelperText: PropTypes.string,
  passwordError: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
};

PersonAccountForm.defaultProps = {
  username: '',
  usernameError: false,
  usernameHelperText: '',
  email: '',
  emailError: false,
  emailHelperText: '',
  password: '',
  passwordError: false,
  passwordHelperText: '',
  dismissPath: '',
};

export default withStyles(styles)(PersonAccountForm);
