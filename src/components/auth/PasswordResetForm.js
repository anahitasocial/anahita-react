import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import HelpIcon from '@material-ui/icons/Help';

const PasswordResetForm = (props) => {
  const {
    handleFieldChange,
    handleFormSubmit,
    email,
    emailError,
    emailHelperText,
    isFetching,
  } = props;

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <HelpIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {'Forgot Password?'}
            </Typography>
          }
        />
        <CardContent>
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
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={isFetching}
            fullWidth
          >
            {'Reset Password'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

PasswordResetForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  email: PropTypes.string,
  emailError: PropTypes.bool,
  emailHelperText: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

PasswordResetForm.defaultProps = {
  email: '',
  emailError: false,
  emailHelperText: '',
};

export default PasswordResetForm;
