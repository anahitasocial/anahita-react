import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { Person as PERSON } from '../constants';

const styles = theme => ({
  root: {
    width: '100%',
  },
  formPaper: {
    padding: '20px',
  },
  formControl: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit,
  },
});

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
    isSuperAdmin,
    error,
    dismissPath,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={0}>
        <Typography variant="title" color="primary">
            Information
        </Typography>
        <form className={classes.container} onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              variant="caption"
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
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
            value={body}
            onChange={handleFieldChange}
            label="Description"
            error={bodyError}
            helperText={bodyHelperText}
            margin="normal"
            fullWidth
            multiline
          />
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="person-usertype">
              {'User Type'}
            </InputLabel>
            <Select
              native
              name="usertype"
              value={usertype}
              onChange={handleFieldChange}
              input={<Input id="person-usertype" />}
            >
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
            variant="raised"
            color="primary"
            className={classes.button}
          >
            {'Save'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

PersonInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  body: PropTypes.string,
  bodyError: PropTypes.bool.isRequired,
  bodyHelperText: PropTypes.string,
  givenName: PropTypes.string,
  givenNameError: PropTypes.bool.isRequired,
  givenNameHelperText: PropTypes.string,
  familyName: PropTypes.string,
  familyNameError: PropTypes.bool.isRequired,
  familyNameHelperText: PropTypes.string,
  gender: PropTypes.string,
  usertype: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissPath: PropTypes.string,
};

PersonInfoForm.defaultProps = {
  givenName: '',
  givenNameHelperText: '',
  familyName: '',
  familyNameHelperText: '',
  body: '',
  bodyHelperText: '',
  gender: '',
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(PersonInfoForm);
