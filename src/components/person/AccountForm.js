import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

import { Person as PERSON } from '../../constants';

const PersonAccountForm = (props) => {
  const {
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    fields: {
      username,
      email,
      password,
    },
    isFetching,
    dismissPath,
  } = props;

  const { FIELDS } = PERSON;
  const enableSubmit = username.isValid && email.isValid && password.isValid;

  return (
    <form onSubmit={handleOnSubmit} autoComplete="off">
      <CardContent>
        <Typography variant="h6" color="primary">
          Account Information
        </Typography>
        <TextField
          name="username"
          value={username.value}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          label="Username"
          error={username.error !== ''}
          helperText={username.error}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: FIELDS.USERNAME.MAX_LENGTH,
            minLength: FIELDS.USERNAME.MIN_LENGTH,
          }}
          required
        />
        <TextField
          type="email"
          name="email"
          value={email.value}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          label="Email"
          error={email.error !== ''}
          helperText={email.error}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: FIELDS.EMAIL.MAX_LENGTH,
            minLength: FIELDS.EMAIL.MIN_LENGTH,
          }}
          required
        />
        <TextField
          type="password"
          name="password"
          value={password.value}
          onChange={handleOnChange}
          label="New Password"
          error={password.error !== ''}
          helperText={password.error}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: FIELDS.PASSWORD.MAX_LENGTH,
            minLength: FIELDS.PASSWORD.MIN_LENGTH,
          }}
          required
        />
      </CardContent>
      <CardActions>
        {dismissPath &&
        <Button
          component={Link}
          to={dismissPath}
          fullWidth
        >
          Dismiss
        </Button>
        }
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={isFetching || !enableSubmit}
          fullWidth
        >
          Save
        </Button>
      </CardActions>
    </form>
  );
};

PersonAccountForm.propTypes = {
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string.isRequired,
};

export default PersonAccountForm;
