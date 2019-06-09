import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from 'react-router-dom/Link';
import { Person as PERSON } from '../../constants';

const styles = (theme) => {
  return {
    formPaper: {
      padding: theme.spacing(2),
    },
    formControl: {
      marginTop: theme.spacing(3),
      display: 'block',
    },
    group: {},
    button: {
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(),
    },
  };
};

const PersonInfoForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    givenName,
    givenNameError,
    givenNameHelperText,
    familyName,
    familyNameError,
    familyNameHelperText,
    body,
    bodyError,
    bodyHelperText,
    gender,
    usertype,
    dismissPath,
    isFetching,
    canChangeUsertype,
    isSuperAdmin,
  } = props;

  return (
    <Paper className={classes.formPaper} elevation={0}>
      <Typography variant="h6" color="primary">
          Information
      </Typography>
      <form className={classes.container} onSubmit={handleFormSubmit}>
        <TextField
          name="givenName"
          value={givenName}
          onChange={handleFieldChange}
          label="First Name"
          error={givenNameError}
          helperText={givenNameHelperText}
          autoFocus
          fullWidth
          margin="normal"
        />
        <TextField
          name="familyName"
          value={familyName}
          onChange={handleFieldChange}
          label="Last Name"
          error={familyNameError}
          helperText={familyNameHelperText}
          fullWidth
          margin="normal"
        />
        <TextField
          name="body"
          value={body || ''}
          onChange={handleFieldChange}
          label="Bio"
          error={bodyError}
          helperText={bodyHelperText}
          margin="normal"
          fullWidth
          multiline
        />
        <FormControl className={classes.formControl}>
          <FormLabel component="legend">
            {'What pronoun do you use?'}
          </FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            className={classes.group}
            value={gender}
            onChange={handleFieldChange}
          >
            <FormControlLabel
              value={PERSON.GENDER.FEMALE}
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel
              value={PERSON.GENDER.MALE}
              control={<Radio />}
              label="Male"
            />
            <FormControlLabel
              value={PERSON.GENDER.NEUTRAL}
              control={<Radio />}
              label="Neutral"
            />
          </RadioGroup>
        </FormControl>
        {canChangeUsertype &&
        <FormControl className={classes.formControl}>
          <FormLabel component="legend">
            {'User Type'}
          </FormLabel>
          <RadioGroup
            aria-label="usertype"
            name="usertype"
            className={classes.group}
            value={usertype}
            onChange={handleFieldChange}
          >
            <FormControlLabel
              value={PERSON.TYPE.REGISTERED}
              control={<Radio />}
              label="Registered"
            />
            <FormControlLabel
              value={PERSON.TYPE.ADMIN}
              control={<Radio />}
              label="Administrator"
            />
            {isSuperAdmin &&
            <FormControlLabel
              value={PERSON.TYPE.SUPER_ADMIN}
              control={<Radio />}
              label="Super Administrator"
            />
            }
          </RadioGroup>
        </FormControl>
        }
        {dismissPath &&
        <Button
          className={classes.button}
          component={Link}
          to={dismissPath}
        >
          {'Dismiss'}
        </Button>
        }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={isFetching}
        >
          {'Save'}
        </Button>
      </form>
    </Paper>
  );
};

PersonInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  givenName: PropTypes.string,
  givenNameError: PropTypes.bool,
  givenNameHelperText: PropTypes.string,
  familyName: PropTypes.string,
  familyNameError: PropTypes.bool,
  familyNameHelperText: PropTypes.string,
  body: PropTypes.string,
  bodyError: PropTypes.bool,
  bodyHelperText: PropTypes.string,
  gender: PropTypes.oneOf([
    PERSON.GENDER.FEMALE,
    PERSON.GENDER.MALE,
    PERSON.GENDER.NEUTRAL,
  ]),
  usertype: PropTypes.oneOf([
    PERSON.TYPE.REGISTERED,
    PERSON.TYPE.ADMIN,
    PERSON.TYPE.SUPER_ADMIN,
  ]).isRequired,
  canChangeUsertype: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
  isFetching: PropTypes.bool,
};

PersonInfoForm.defaultProps = {
  givenName: '',
  givenNameError: false,
  givenNameHelperText: '',
  familyName: '',
  familyNameError: false,
  familyNameHelperText: '',
  body: '',
  bodyError: false,
  bodyHelperText: '',
  gender: PERSON.GENDER.NEUTRAL,
  dismissPath: '',
  isFetching: false,
};

export default withStyles(styles)(PersonInfoForm);
