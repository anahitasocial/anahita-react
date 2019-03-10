import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Fade from '@material-ui/core/Fade';
import CoverIcon from '@material-ui/icons/Panorama';

const styles = (theme) => {
  return {
    cover: {
      width: '100%',
      height: theme.spacing.unit * 45,
    },
    coverPlaceholder: {
      width: '100%',
      height: theme.spacing.unit * 45,
      backgroundColor: theme.palette.background.default,
    },
    coverIcon: {
      width: theme.spacing.unit * 10,
      height: theme.spacing.unit * 10,
      margin: '10% auto',
    },
    button: {
      position: 'relative',
      width: '100%',
      height: theme.spacing.unit * 45,
    },
    input: {
      display: 'none',
    },
  };
};

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
    <React.Fragment>
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
        {isWaiting &&
          <CircularProgress />
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
    </React.Fragment>
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
