import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Link from 'react-router-dom/Link';
import TextFieldUsername from '../textfields/TextFieldUsername';
import TextFieldEmail from '../textfields/TextFieldEmail';
import { Person as PERSON } from '../../constants';

const styles = (theme) => {
  return {
    formPaper: {
      padding: theme.spacing.unit * 2,
    },
    formControl: {
      marginTop: theme.spacing.unit * 3,
      display: 'block',
    },
    button: {
      marginTop: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit,
    },
  };
};

const PersonAddForm = (props) => {
  const {
    classes,
    formTitle,
    isSuperAdmin,
    handleFieldChange,
    handleFormSubmit,
    givenName,
    givenNameError,
    givenNameHelperText,
    familyName,
    familyNameError,
    familyNameHelperText,
    username,
    usernameHelperText,
    usernameError,
    email,
    emailHelperText,
    emailError,
    usertype,
    usertypeError,
    isFetching,
    dismissPath,
  } = props;

  return (
    <Paper className={classes.formPaper} elevation={0}>
      {formTitle &&
        <Typography
          variant="h6"
          color="primary"
          className={classes.formTitle}
        >
          {formTitle}
        </Typography>
      }
      <form onSubmit={handleFormSubmit}>
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
        <TextFieldUsername
          value={username}
          onChange={handleFieldChange}
          error={usernameError}
          helperText={usernameHelperText}
        />
        <TextFieldEmail
          value={email}
          onChange={handleFieldChange}
          error={emailError}
          helperText={emailHelperText}
        />
        <FormControl className={classes.formControl}>
          <InputLabel
            htmlFor="person-usertype"
            shrink
          >
            {'User Type'}
          </InputLabel>
          <Select
            native
            name="usertype"
            value={usertype}
            error={usertypeError}
            onChange={handleFieldChange}
            input={<Input id="person-usertype" />}
          >
            <option value="">
              {'Select Type'}
            </option>
            <option value={PERSON.TYPE.REGISTERED}>
              {'Registered'}
            </option>
            <option value={PERSON.TYPE.ADMIN}>
              {'Administrator'}
            </option>
            {isSuperAdmin &&
              <option value={PERSON.TYPE.SUPER_ADMIN}>
                {'Super Administrator'}
              </option>
            }
          </Select>
        </FormControl>
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

PersonAddForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formTitle: PropTypes.string,
  isSuperAdmin: PropTypes.bool.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  givenName: PropTypes.string,
  givenNameError: PropTypes.bool,
  givenNameHelperText: PropTypes.string,
  familyName: PropTypes.string,
  familyNameError: PropTypes.bool,
  familyNameHelperText: PropTypes.string,
  username: PropTypes.string,
  usernameHelperText: PropTypes.string,
  usernameError: PropTypes.bool,
  email: PropTypes.string,
  emailHelperText: PropTypes.string,
  emailError: PropTypes.bool,
  usertype: PropTypes.string,
  usertypeError: PropTypes.bool,
  isFetching: PropTypes.bool,
  dismissPath: PropTypes.string,
};

PersonAddForm.defaultProps = {
  formTitle: '',
  givenName: '',
  givenNameError: false,
  givenNameHelperText: '',
  familyName: '',
  familyNameError: false,
  familyNameHelperText: '',
  username: '',
  usernameError: false,
  usernameHelperText: '',
  email: '',
  emailError: false,
  emailHelperText: '',
  usertype: '',
  usertypeError: false,
  isFetching: false,
  dismissPath: '',
};

export default withStyles(styles)(PersonAddForm);
