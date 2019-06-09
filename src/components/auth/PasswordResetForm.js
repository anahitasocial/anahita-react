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
      marginTop: 10,
      width: '100%',
    },
  };
};

const PasswordResetForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    email,
    emailError,
    emailHelperText,
    isFetching,
  } = props;

  return (
    <Paper className={classes.formPaper} elevation={2}>
      <Typography
        variant="h6"
        color="primary"
        className={classes.title}
      >
        {'Forgot Password?'}
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          name="email"
          value={email}
          onChange={handleFieldChange}
          label="What is your email?"
          error={emailError}
          helperText={emailHelperText}
          autoFocus
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
          {'Reset Password'}
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
  );
};

PasswordResetForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  email: PropTypes.string,
  emailError: PropTypes.bool,
  emailHelperText: PropTypes.string,
  isFetching: PropTypes.bool,
};

PasswordResetForm.defaultProps = {
  email: '',
  emailError: false,
  emailHelperText: '',
  isFetching: false,
};

export default withStyles(styles)(PasswordResetForm);
