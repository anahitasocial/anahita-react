import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Fade from '@material-ui/core/Fade';
import CoverIcon from '@material-ui/icons/Panorama';

const styles = theme => ({
  root: {
    width: '100%',
  },
  cover: {
    width: '100%',
    minHeight: 300,
  },
  coverPlaceholder: {
    width: '100%',
    minHeight: 300,
    backgroundColor: theme.palette.background.default,
  },
  coverIcon: {
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10,
    margin: '10% auto',
  },
  loader: {
    height: 3,
  },
  button: {
    position: 'relative',
    width: '100%',
    minHeight: 300,
  },
  input: {
    display: 'none',
  },
});

const ActorCoverForm = (props) => {
  const {
    classes,
    name,
    cover,
    anchorEl,
    isFetching,
    isCoverLoaded,
    isWaiting,
    canEdit,
    hasCover,
    handleOpen,
    handleClose,
    handleFieldChange,
    handleDelete,
  } = props;

  return (
    <div className={classes.root}>
      <ButtonBase
        className={classes.button}
        disabled={!canEdit || isFetching}
        onClick={handleOpen}
      >
        {hasCover && isCoverLoaded &&
          <Fade in>
            <CardMedia
              className={classes.cover}
              title={name}
              image={cover.src}
            />
          </Fade>
        }
        {!hasCover &&
          <div className={classes.coverPlaceholder}>
            <CoverIcon
              className={classes.coverIcon}
              color="disabled"
            />
          </div>
        }
      </ButtonBase>
      <Menu
        id="cover-add-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <label htmlFor="selectCoverFile">
            <input
              accept="image/*"
              className={classes.input}
              id="selectCoverFile"
              type="file"
              disabled={!canEdit || isFetching}
              onChange={handleFieldChange}
            />
            {'Upload Cover'}
          </label>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {'Delete'}
        </MenuItem>
      </Menu>
      <div className={classes.loader}>
        {isWaiting &&
          <LinearProgress className={classes.loader} />
        }
      </div>
    </div>
  );
};

ActorCoverForm.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  cover: PropTypes.object,
  anchorEl: PropTypes.object,
  isFetching: PropTypes.bool,
  isCoverLoaded: PropTypes.bool,
  isWaiting: PropTypes.bool,
  hasCover: PropTypes.bool,
  canEdit: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

ActorCoverForm.defaultProps = {
  isFetching: false,
  canEdit: false,
  hasCover: false,
  name: '',
  cover: {
    src: '',
  },
  isCoverLoaded: false,
  isWaiting: false,
  anchorEl: null,
};

export default withStyles(styles)(ActorCoverForm);
