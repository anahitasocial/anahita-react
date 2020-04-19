import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import PersonType from '../../proptypes/Person';

import { Person as PERSON } from '../../constants';

const PersonAccount = (props) => {
  const {
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    fields: {
      username,
      email,
      password,
    },
    person,
    isFetching,
    dismissPath,
  } = props;

  const { FIELDS } = PERSON;

  return (
    <form
      onSubmit={handleOnSubmit}
      autoComplete="off"
      noValidate
    >
      <CardContent>
        <Typography variant="h6" color="primary">
          Account Information
        </Typography>
        <TextField
          name="username"
          value={person.username}
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
          value={person.email}
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
          value={person.password}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          label="New password"
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
          disabled={isFetching}
          fullWidth
        >
          Save
        </Button>
      </CardActions>
    </form>
  );
};

PersonAccount.propTypes = {
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  person: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string.isRequired,
};

export default PersonAccount;
