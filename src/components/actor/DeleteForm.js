import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from 'react-router-dom/Link';

const styles = (theme) => {
  return {
    formPaper: {
      padding: '20px',
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    title: {
      marginBottom: 10,
    },
  };
};

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
    <React.Fragment>
      <Paper className={classes.formPaper} elevation={0}>
        <Typography
          variant="h6"
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
            color="secondary"
            className={classes.button}
            disabled={isFetching || !canDelete}
          >
            {'Delete'}
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
