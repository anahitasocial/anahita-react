import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

import ActorsFormsMetadata from '../actor/forms/Metadata';

import PersonType from '../../proptypes/Person';
import { Person as PERSON } from '../../constants';
import i18n from '../../languages';

const {
  GIVEN_NAME,
  FAMILY_NAME,
  BODY,
  GENDER,
  TYPE,
} = PERSON.FIELDS;

const PersonInfo = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields,
    person,
    canChangeUsertype,
    isSuperAdmin,
    isFetching,
    enabled,
  } = props;

  const isNew = !person.id;

  const {
    givenName,
    familyName,
    body,
    website,
    contact_url: contactUrl,
    phone,
  } = fields;

  const enableSubmit = !isNew || (
    givenName.isValid &&
    familyName.isValid &&
    body.isValid &&
    website.isValid &&
    contactUrl.isValid &&
    phone.isValid
  );

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      {!canChangeUsertype &&
        <input
          type="hidden"
          name="usertype"
          value={person.usertype}
        />}
      <CardContent>
        {enabled}
        <TextField
          name="givenName"
          value={person.givenName}
          onChange={handleOnChange}
          label={i18n.t('people:person.givenName')}
          error={givenName.error !== ''}
          helperText={givenName.error}
          autoFocus
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: GIVEN_NAME.MAX_LENGTH,
            minLength: GIVEN_NAME.MIN_LENGTH,
          }}
          required
        />
        <TextField
          name="familyName"
          value={person.familyName}
          onChange={handleOnChange}
          label={i18n.t('people:person.familyName')}
          error={familyName.error !== ''}
          helperText={familyName.error}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: FAMILY_NAME.MAX_LENGTH,
            minLength: FAMILY_NAME.MIN_LENGTH,
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
          <FormLabel component="legend">
            {i18n.t('people:person.whatPronouns')}
          </FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={person.gender}
            onChange={handleOnChange}
          >
            <FormControlLabel
              value={GENDER.FEMALE}
              control={<Radio />}
              label={i18n.t('people:person.pronounOptions.feminine')}
            />
            <FormControlLabel
              value={GENDER.MALE}
              control={<Radio />}
              label={i18n.t('people:person.pronounOptions.masculine')}
            />
            <FormControlLabel
              value={GENDER.NEUTRAL}
              control={<Radio />}
              label={i18n.t('people:person.pronounOptions.nonbinary')}
            />
          </RadioGroup>
        </FormControl>
        {canChangeUsertype &&
        <FormControl margin="normal" fullWidth>
          <FormLabel component="legend">
            {i18n.t('people:person.usertype')}
          </FormLabel>
          <RadioGroup
            aria-label="usertype"
            name="usertype"
            value={person.usertype}
            onChange={handleOnChange}
          >
            <FormControlLabel
              value={TYPE.REGISTERED}
              control={<Radio />}
              label={i18n.t('people:person.usertypeOptions.registered')}
            />
            <FormControlLabel
              value={TYPE.ADMIN}
              control={<Radio />}
              label={i18n.t('people:person.usertypeOptions.administrator')}
            />
            {isSuperAdmin &&
              <FormControlLabel
                value={TYPE.SUPER_ADMIN}
                control={<Radio />}
                label={i18n.t('people:person.usertypeOptions.super-administrator')}
              />}
          </RadioGroup>
        </FormControl>}
        <ActorsFormsMetadata
          handleOnChange={handleOnChange}
          fields={fields}
          actor={person}
        />
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
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

PersonInfo.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  person: PersonType.isRequired,
  canChangeUsertype: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enabled: PropTypes.node,
};

PersonInfo.defaultProps = {
  enabled: null,
};

export default PersonInfo;
