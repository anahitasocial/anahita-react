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

import { Password as PASSWORD } from '../../constants';

const PasswordResetForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    isFetching,
    fields: {
      email,
    },
  } = props;

  const { EMAIL } = PASSWORD.FIELDS;

  const enableSubmit = email.isValid;

  return (
    <form onSubmit={handleOnSubmit}>
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <HelpIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              Forgot Password?
            </Typography>
          }
        />
        <CardContent>
          <TextField
            name="email"
            value={email.value}
            onChange={handleOnChange}
            label="What is your email?"
            error={email.error !== ''}
            helperText={email.error}
            autoFocus
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: EMAIL.MAX_LENGTH,
              minLength: EMAIL.MIN_LENGTH,
            }}
            required
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={isFetching || !enableSubmit}
            fullWidth
          >
            Reset Password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

PasswordResetForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default PasswordResetForm;
