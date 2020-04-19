import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
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
    fields: {
      givenName,
      familyName,
      body,
    },
    person,
    canChangeUsertype,
    isSuperAdmin,
    dismissPath,
    isFetching,
  } = props;

  const isNew = !person.id;

  const enableSubmit = !isNew || (
    givenName.isValid &&
    familyName.isValid &&
    body.isValid
  );

  const formTitle = isNew ? 'Add a new person' : 'Edit Person';

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <Typography variant="h6" color="primary">
          {formTitle}
        </Typography>
        <TextField
          name="givenName"
          value={person.givenName}
          onChange={handleOnChange}
          label="First Name"
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
          label="Last Name"
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
          value={person.body}
          onChange={handleOnChange}
          label="Bio"
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
            What pronoun do you use?
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
              label="Female"
            />
            <FormControlLabel
              value={GENDER.MALE}
              control={<Radio />}
              label="Male"
            />
            <FormControlLabel
              value={GENDER.NEUTRAL}
              control={<Radio />}
              label="Neutral"
            />
          </RadioGroup>
        </FormControl>
        {canChangeUsertype &&
        <FormControl margin="normal" fullWidth>
          <FormLabel component="legend">
            User Type
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
              label="Registered"
            />
            <FormControlLabel
              value={TYPE.ADMIN}
              control={<Radio />}
              label="Administrator"
            />
            {isSuperAdmin &&
            <FormControlLabel
              value={TYPE.SUPER_ADMIN}
              control={<Radio />}
              label="Super Administrator"
            />
            }
          </RadioGroup>
        </FormControl>
        }
      </CardContent>
      <CardActions>
        {dismissPath &&
        <Button
          component={Link}
          to={dismissPath}
        >
          Dismiss
        </Button>
        }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching || !enableSubmit}
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
  dismissPath: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
};

PersonInfo.defaultProps = {
  dismissPath: '',
};

export default PersonInfo;
