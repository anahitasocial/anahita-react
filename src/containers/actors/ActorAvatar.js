import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import {
  addAvatar,
  deleteAvatar,
} from '../../actions/actor';
import { Person as PERSON } from '../../constants';

const styles = theme => ({
  root: {
    width: '100%',
  },
  avatar: {
    width: theme.spacing.unit * 15,
    height: theme.spacing.unit * 15,
  },
  button: {
    position: 'relative',
    width: theme.spacing.unit * 15,
    height: theme.spacing.unit * 15,
    zIndex: 1,
  },
  input: {
    display: 'none',
  },
});

class ActorAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  addAvatar() {
    const { actor } = this.props;
    this.props.addAvatar(actor, this.file);
  }

  deleteAvatar() {
    const { actor } = this.props;
    this.props.deleteAvatar(actor);
  }

  handleFieldChange(event) {
    const file = event.target.files[0];
    this.file = file;
    this.addAvatar();
    this.setState({
      anchorEl: null,
    });
  }

  handleDelete() {
    this.deleteAvatar();
    this.setState({
      anchorEl: null,
    });
  }

  handleOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  canEdit() {
    const { viewer, actor } = this.props;

    if (viewer.id === actor.id) {
      return true;
    }

    if (actor.administratorIds) {
      if (actor.administratorIds.indexOf(String(viewer.id)) > -1) {
        return true;
      }
    }

    if ([
      PERSON.TYPE.ADMIN,
      PERSON.TYPE.SUPER_ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    return false;
  }

  render() {
    const {
      classes,
      isFetching,
      actor,
    } = this.props;

    const { anchorEl } = this.state;

    const src = actor.imageURL && actor.imageURL.large && actor.imageURL.large.url;

    return (
      <div className={classes.root}>
        <Button
          component="span"
          className={classes.button}
          disabled={!this.canEdit() || isFetching}
          onClick={this.handleOpen}
        >
          <Avatar
            aria-label={actor.name}
            className={classes.avatar}
            alt={actor.name}
            src={src}
          >
            {!src && actor.name.charAt(0)}
          </Avatar>
        </Button>

        <Menu
          id="avatar-add-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem>
            <label htmlFor="selectAvatarFile">
              <input
                accept="image/*"
                className={classes.input}
                id="selectAvatarFile"
                type="file"
                disabled={!this.canEdit() || isFetching}
                onChange={this.handleFieldChange}
              />
              {'Upload Avatar'}
            </label>
          </MenuItem>
          <MenuItem onClick={this.handleDelete}>
            {'Delete'}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

ActorAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  addAvatar: PropTypes.func.isRequired,
  deleteAvatar: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
};

ActorAvatar.defaultProps = {
  isFetching: false,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.authReducer;

  return {
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAvatar: (actor, file) => {
      dispatch(addAvatar(actor, file));
    },
    deleteAvatar: (actor) => {
      dispatch(deleteAvatar(actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorAvatar));
