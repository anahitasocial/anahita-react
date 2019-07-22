import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const styles = (theme) => {
  return {
    formPaper: {
      padding: '20px',
    },
    formTitle: {
      textTransform: 'capitalize',
    },
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
    },
  };
};

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
    isFetching,
    dismissPath,
  } = props;

  return (
    <React.Fragment>
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
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={isFetching}
          >
            {'Save'}
          </Button>
        </form>
      </Paper>
    </React.Fragment>
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
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
