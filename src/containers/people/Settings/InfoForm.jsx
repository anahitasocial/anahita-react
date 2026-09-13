import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import PersonType from '../../../proptypes/Person';
import { Person as PERSON } from '../../../constants';
import SelectPronouns from '../../../components/SelectPronouns';
import i18n from '../../../languages';

const {
  NAME,
  BODY,
} = PERSON.FIELDS;

const PersonInfo = ({
  handleOnChange,
  handleOnSubmit,
  handleOnCancel,
  fields,
  person,
  isFetching = false,
  enabled = null,
}) => {
  const isNew = !person.id;

  const {
    name,
    body,
  } = fields;

  const enableSubmit = !isNew || (
    name.isValid &&
    body.isValid
  );

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        {enabled}
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
          name="body"
          value={person.body || ''}
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
            super administrator, audited — not before.

            InfoRead.jsx still DISPLAYS the role, correctly, off personType.
            Reading it was never the broken half. */}
        <TextField
          name="websiteUrl"
          value={person.websiteUrl || ''}
          onChange={handleOnChange}
          error={fields.websiteUrl.error !== ''}
          helperText={fields.websiteUrl.error}
          label={i18n.t('actor:website')}
          placeholder="example.com"
          margin="normal"
          fullWidth
          // Deliberately not type="url". Validation here runs through the
          // DOM's checkValidity, and a url input rejects a bare
          // "example.com" — which the server accepts and normalises to
          // https://example.com. A stricter client than server would refuse
          // the most natural thing anyone types. inputMode still gets the
          // URL keyboard on mobile.
          inputProps={{ maxLength: 255, inputMode: 'url' }}
        />
      </CardContent>
      {/* Cancel then Save, both full width — the same CardActions row every
          other card in this section uses. Save was a hardcoded English
          string; actions:save is the key the rest of the app uses for it. */}
      <CardActions>
        <Button
          onClick={handleOnCancel}
          disabled={isFetching}
          fullWidth
        >
          {i18n.t('actions:cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching || !enableSubmit}
          fullWidth
        >
          {i18n.t('actions:save')}
        </Button>
      </CardActions>
    </form>
  );
};

PersonInfo.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnCancel: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  person: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enabled: PropTypes.node,
};

export default PersonInfo;
