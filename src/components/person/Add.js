import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import PersonType from '../../proptypes/Person';
import { Person as PERSON } from '../../constants';
import i18n from '../../languages';

const {
  GIVEN_NAME,
  FAMILY_NAME,
  USERNAME,
  EMAIL,
  BODY,
  GENDER,
  TYPE,
} = PERSON.FIELDS;

const PersonAdd = (props) => {
  const {
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    fields: {
      givenName,
      familyName,
      body,
      username,
      email,
    },
    person,
    isSuperAdmin,
    dismissPath,
    isFetching,
  } = props;

  const isNew = !person.id;

  const enableSubmit = !isNew || (
    givenName.isValid &&
    familyName.isValid &&
    body.isValid &&
    email.isValid
  );

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <FormControl component="fieldset" margin="normal" fullWidth>
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
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">
            {i18n.t('people:person.pronouns')}
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
        <FormControl component="fieldset" margin="normal" fullWidth>
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
        </FormControl>
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

PersonAdd.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  person: PersonType.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

PersonAdd.defaultProps = {
  dismissPath: '',
};

export default PersonAdd;
