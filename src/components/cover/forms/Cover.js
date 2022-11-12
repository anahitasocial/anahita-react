import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Fade from '@material-ui/core/Fade';

import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const styles = (theme) => {
  return {
    coverPlaceholder: {
      height: theme.spacing(40),
    },
    cover: {
      width: '100%',
      height: theme.spacing(40),
    },
    coverIcon: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      margin: '10% auto',
    },
    button: {
      position: 'relative',
      width: '100%',
      height: theme.spacing(40),
      backgroundColor: theme.palette.background.default,
    },
    input: {
      display: 'none',
    },
    progress: {
      position: 'absolute',
    },
  };
};

const ActorCoverForm = (props) => {
  const {
    classes,
    node,
    cover,
    anchorEl,
    isFetching,
    canEdit,
    handleOpen,
    handleClose,
    handleFieldChange,
    handleDelete,
  } = props;

  return (
    <>
      <ButtonBase
        className={classes.button}
        disabled={!canEdit || isFetching}
        onClick={handleOpen}
      >
        {cover &&
          <Fade in>
            <CardMedia
              className={classes.cover}
              title={node.name}
              image={cover}
              src="picture"
            />
          </Fade>}
        {!cover && <div className={classes.coverPlaceholder} />}
        {isFetching && <CircularProgress className={classes.progress} />}
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
            {i18n.t('actions:Update')}
          </label>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {i18n.t('actions:delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

ActorCoverForm.propTypes = {
  classes: PropTypes.object.isRequired,
  node: NodeType.isRequired,
  cover: PropTypes.string,
  anchorEl: PropTypes.object,
  isFetching: PropTypes.bool,
  canEdit: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

ActorCoverForm.defaultProps = {
  isFetching: false,
  canEdit: false,
  cover: '',
  anchorEl: null,
};

export default withStyles(styles)(ActorCoverForm);
