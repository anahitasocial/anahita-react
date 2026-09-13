import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import PersonType from '../../../proptypes/Person';
import { Person as PERSON } from '../../../constants';
import SelectPronouns from '../../../components/SelectPronouns';
import i18n from '../../../languages';

const {
  NAME,
  USERNAME,
  EMAIL,
  BODY,
} = PERSON.FIELDS;

const PersonAddForm = (props) => {
  const {
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    fields: {
      name,
      body,
      username,
      email,
    },
    person,
    dismissPath = '',
    isFetching,
  } = props;

  const isNew = !person.id;

  const enableSubmit = !isNew || (
    name.isValid &&
    body.isValid &&
    email.isValid
  );

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <FormControl component="fieldset" margin="normal" fullWidth>
          <TextField
            name="name"
            value={person.name || ''}
            onChange={handleOnChange}
            label={i18n.t('people:person.displayName')}
            error={name.error !== ''}
            helperText={name.error}
            autoFocus
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: NAME.MAX_LENGTH,
              minLength: NAME.MIN_LENGTH,
            }}
            required
          />
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
              maxLength: USERNAME.MAX_LENGTH,
              minLength: USERNAME.MIN_LENGTH,
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
              maxLength: EMAIL.MAX_LENGTH,
              minLength: EMAIL.MIN_LENGTH,
            }}
            required
          />
          <TextField
            name="body"
            value={person.body}
            onChange={handleOnChange}
            label={i18n.t('people:person.body')}
            error={body.error !== ''}
            helperText={body.error}
            margin="normal"
            fullWidth
            multiline
            inputProps={{
              maxLength: BODY.MAX_LENGTH,
              minLength: BODY.MIN_LENGTH,
            }}
            required
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="pronouns-label" shrink>
            {i18n.t('people:person.pronouns')}
          </InputLabel>
          <SelectPronouns
            labelId="pronouns-label"
            name="personPronouns"
            value={person.personPronouns || ''}
            onChange={handleOnChange}
          />
        </FormControl>
        {/* The role radio group was removed here.

            It read `person.usertype` while the API sends `person_type`, which
            camel-cases to `personType` — so nothing was ever selected — and it
            submitted `usertype`, which no request binds. There is no
            promote/demote endpoint at all: `person_type` is written by signup
            and by the first-super-administrator seed, and nowhere else.

            So the control could not show a role and could not change one. An
            administrator using it believed they had, which is worse than it
            not being there. It comes back when a deliberate promote/demote
            flow exists — super-admin only, guarded against removing the last
            super administrator, audited — not before. */}
      </CardContent>
      <CardActions>
        {dismissPath &&
        <Button
          component={Link}
          href={dismissPath}
          to={dismissPath}
          fullWidth
        >
          {i18n.t('actions:cancel')}
        </Button>}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching || !enableSubmit}
        >
          {i18n.t('actions:add')}
        </Button>
      </CardActions>
    </form>
  );
};

PersonAddForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  person: PersonType.isRequired,
  dismissPath: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

export default PersonAddForm;
