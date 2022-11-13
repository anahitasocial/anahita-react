import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import PersonType from '../../proptypes/Person';
import { Person as PERSON } from '../../constants';
import i18n from '../../languages';

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
  } = props;

  const { FIELDS } = PERSON;

  return (
    <form
      onSubmit={handleOnSubmit}
      autoComplete="off"
      noValidate
    >
      <CardContent>
        <TextField
          name="username"
          value={person.username}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          label={i18n.t('people:person.username')}
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
          label={i18n.t('people:person.email')}
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
          label={i18n.t('people:person.newPassword')}
          error={password.error !== ''}
          helperText={password.error}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: FIELDS.PASSWORD.MAX_LENGTH,
            minLength: FIELDS.PASSWORD.MIN_LENGTH,
            autoComplete: 'off',
          }}
          required
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
          {i18n.t('actions:update')}
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
};

export default PersonAccount;
