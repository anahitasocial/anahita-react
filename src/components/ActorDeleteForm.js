import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    width: '100%',
  },
  formPaper: {
    padding: '20px',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  title: {
    marginBottom: 10,
  },
});

const ActorInfoForm = (props) => {
  const {
    classes,
    handleFieldChange,
    handleFormSubmit,
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
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={0}>
        <Typography
          variant="title"
          color="primary"
          className={classes.title}
        >
          {'Delete Forever!'}
        </Typography>
        {isFetching &&
          <LinearProgress className={classes.progress} />
        }
        <form className={classes.container} onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              variant="display1"
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
            color="secondary"
            className={classes.button}
            disabled={isFetching || !canDelete}
          >
            {'Delete'}
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
  referenceAlias: PropTypes.string.isRequired,
  alias: PropTypes.string,
  aliasError: PropTypes.bool,
  aliasHelperText: PropTypes.string,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  canDelete: PropTypes.bool,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  alias: '',
  aliasError: false,
  aliasHelperText: '',
  isFetching: false,
  error: '',
  canDelete: false,
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
