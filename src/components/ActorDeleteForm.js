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
  colorError: {
    color: theme.palette.error.A400,
  },
  button: {
    marginTop: 10,
    marginRight: 10,
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
    hasAlias,
    alias,
    error,
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
              variant="caption"
              classes={classes.colorError}
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
          <TextField
            name="alias"
            onChange={handleFieldChange}
            label={`Type the exact alias: ${alias}`}
            error={!hasAlias}
            helperText={!hasAlias ? 'You must type the exact alias to delete this profile!' : 'This is the correct alias!'}
            margin="normal"
            fullWidth
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
            disabled={isFetching}
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
  alias: PropTypes.string,
  hasAlias: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  hasAlias: true,
  isFetching: false,
  alias: '',
  error: '',
  dismissPath: '',
};

export default withStyles(styles)(ActorInfoForm);
