import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { CircularProgress } from 'material-ui/Progress';
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
      avatarLoaded: false,
    };

    this.avatar = new Image();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadAvatar(this.props.actor);
  }

  componentWillReceiveProps(nextProps) {
    this.loadAvatar(nextProps.actor);
  }

  componentWillUnmount() {
    this.avatar.onload = null;
    this.avatar.onerror = null;
  }

  loadAvatar(actor) {
    this.avatar.onload = () => {
      this.setState({
        avatarLoaded: true,
      });
    };
    this.avatar.onError = () => {
      this.setState({
        avatarLoaded: false,
      });
    };

    this.avatar.src = actor.imageURL &&
    actor.imageURL.large &&
    actor.imageURL.large.url;
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

  hasAvatar() {
    const { actor } = this.props;
    return actor.imageURL && actor.imageURL.large;
  }

  isWaiting() {
    return !this.state.avatarLoaded || this.props.isFetching;
  }

  render() {
    const {
      classes,
      isFetching,
      actor,
    } = this.props;

    const { anchorEl, avatarLoaded } = this.state;

    return (
      <div className={classes.root}>
        <IconButton
          color="primary"
          component="span"
          className={classes.button}
          disabled={!this.canEdit() || isFetching}
          onClick={this.handleOpen}
        >
          {this.hasAvatar() &&
            <Avatar
              aria-label={actor.name}
              className={classes.avatar}
              alt={actor.name}
              src={avatarLoaded ? this.avatar.src : ''}
            >
              {this.isWaiting() &&
                <CircularProgress />
              }
            </Avatar>
          }
          {!this.hasAvatar() &&
            <Avatar
              aria-label={actor.name}
              className={classes.avatar}
              alt={actor.name}
              src={avatarLoaded ? this.avatar.src : ''}
            >
              {actor.name.charAt(0)}
            </Avatar>
          }
        </IconButton>

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
