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
  formPaper: {
    padding: '20px',
  },
  formTitle: {
    textTransform: 'capitalize',
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
    formTitle,
    name,
    nameError,
    nameHelperText,
    body,
    bodyError,
    bodyHelperText,
    error,
    isFetching,
    dismissPath,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={0}>
        {formTitle &&
          <Typography
            variant="title"
            color="primary"
            className={classes.formTitle}
          >
            {formTitle}
          </Typography>
        }
        <form onSubmit={handleFormSubmit}>
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
            name="name"
            value={name}
            onChange={handleFieldChange}
            label="Name"
            error={nameError}
            helperText={nameHelperText}
            margin="normal"
            fullWidth
          />
          <TextField
            name="body"
            value={body}
            onChange={handleFieldChange}
            error={bodyError}
            helperText={bodyHelperText}
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
            disabled={isFetching}
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
  formTitle: PropTypes.string,
  name: PropTypes.string,
  nameError: PropTypes.bool,
  nameHelperText: PropTypes.string,
  body: PropTypes.string,
  bodyError: PropTypes.bool,
  bodyHelperText: PropTypes.string,
  error: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  formTitle: '',
  name: '',
  nameError: false,
  nameHelperText: '',
  body: '',
  bodyError: false,
  bodyHelperText: '',
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
