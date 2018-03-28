import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    width: '100%',
  },
  loginPaper: {
    padding: '20px',
  },
  colorError: {
    color: theme.palette.error.A400,
  },
  button: {
    marginTop: 10,
    marginRight: 10,
  },
});

const ActorInfoForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
    hasName,
    hasGivenName,
    hasFamilyName,
    name,
    givenName,
    familyName,
    body,
    gender,
    error,
    namespace,
    dismissPath,
  } = props;

  const isPerson = namespace === 'people';

  return (
    <div className={classes.root}>
      <Paper className={classes.loginPaper} elevation={0}>
        <Typography variant="title" color="primary">
            Information
        </Typography>
        <form className={classes.container} onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              variant="caption"
              classes={classes.colorError}
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
          {isPerson &&
            <div>
              <TextField
                name="givenName"
                value={givenName || ''}
                onChange={handleFieldChange}
                label="First Name"
                error={!hasGivenName}
                helperText={!hasGivenName ? 'First name is required!' : ''}
                margin="normal"
                autoFocus
                fullWidth
              />
              <TextField
                name="familyName"
                value={familyName || ''}
                onChange={handleFieldChange}
                label="Last Name"
                error={!hasFamilyName}
                helperText={!hasFamilyName ? 'Last name is required!' : ''}
                margin="normal"
                fullWidth
              />
            </div>
          }
          {!isPerson &&
            <TextField
              name="name"
              value={name || ''}
              onChange={handleFieldChange}
              label="Name"
              error={!hasName}
              helperText={!hasName ? 'A name is required!' : ''}
              margin="normal"
              fullWidth
            />
          }
          <TextField
            name="body"
            value={body || ''}
            onChange={handleFieldChange}
            label="Description"
            margin="normal"
            fullWidth
            multiline
          />
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

ActorInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  name: PropTypes.string,
  body: PropTypes.string,
  givenName: PropTypes.string,
  familyName: PropTypes.string,
  gender: PropTypes.string,
  hasName: PropTypes.bool,
  hasGivenName: PropTypes.bool,
  hasFamilyName: PropTypes.bool,
  error: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  hasName: true,
  hasGivenName: true,
  hasFamilyName: true,
  name: '',
  givenName: '',
  familyName: '',
  body: '',
  gender: '',
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
