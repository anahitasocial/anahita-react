import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';

const styles = (theme) => {
  return {
    formPaper: {
      padding: '20px',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    title: {
      marginBottom: 10,
    },
  };
};

const ActorDeleteForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleDelete,
    referenceAlias,
    alias,
    aliasError,
    aliasHelperText,
    error,
    canDelete,
    isFetching,
    dismissPath,
  } = props;

  return (
    <React.Fragment>
      <Paper className={classes.formPaper}>
        <Typography
          variant="h6"
          color="primary"
          className={classes.title}
        >
          Delete Forever!
        </Typography>
        {isFetching &&
          <LinearProgress className={classes.progress} />
        }
        { error &&
          <Typography
            variant="h4"
            color="error"
            paragraph
          >
              {error}
          </Typography>
        }
        <TextField
          name="alias"
          value={alias}
          onChange={handleFieldChange}
          label={`Type the exact alias: ${referenceAlias}`}
          error={aliasError}
          helperText={aliasHelperText}
          margin="normal"
          fullWidth
          disabled={!canDelete}
        />
        {dismissPath &&
        <Button
          component={Link}
          className={classes.button}
          to={dismissPath}
        >
          Dismiss
        </Button>
        }
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleDelete}
          disabled={isFetching || !canDelete}
        >
          Delete
        </Button>
      </Paper>
    </React.Fragment>
  );
};

ActorDeleteForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  referenceAlias: PropTypes.string.isRequired,
  alias: PropTypes.string,
  aliasError: PropTypes.bool,
  aliasHelperText: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  canDelete: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
};

ActorDeleteForm.defaultProps = {
  alias: '',
  aliasError: false,
  aliasHelperText: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorDeleteForm);
