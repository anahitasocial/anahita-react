import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import ButtonBase from 'material-ui/ButtonBase';
import Menu, { MenuItem } from 'material-ui/Menu';
import { LinearProgress } from 'material-ui/Progress';
import { CardMedia } from 'material-ui/Card';
import Fade from 'material-ui/transitions/Fade';
import {
  addCover,
  deleteCover,
} from '../../actions/actor';
import { Person as PERSON } from '../../constants';

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
  button: {
    position: 'relative',
    width: '100%',
    minHeight: 300,
  },
  input: {
    display: 'none',
  },
});

class ActorCover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      coverLoaded: false,
    };

    this.cover = new Image();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadCover(this.props.actor);
  }

  componentWillReceiveProps(nextProps) {
    this.loadCover(nextProps.actor);
  }

  componentWillUnmount() {
    this.cover.onload = null;
    this.cover.onerror = null;
  }

  loadCover(actor) {
    this.cover.onload = () => {
      this.setState({
        coverLoaded: true,
      });
    };
    this.cover.onError = () => {
      this.setState({
        coverLoaded: false,
      });
    };

    this.cover.src = actor.coverURL &&
    actor.coverURL.large &&
    actor.coverURL.large.url;
  }

  addCover() {
    const { actor } = this.props;
    this.props.addCover(actor, this.file);
  }

  deleteCover() {
    const { actor } = this.props;
    this.props.deleteCover(actor);
  }

  handleFieldChange(event) {
    const file = event.target.files[0];
    this.file = file;
    this.addCover();
    this.setState({
      anchorEl: null,
    });
  }

  handleDelete() {
    this.deleteCover();
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

  hasCover() {
    const { actor } = this.props;
    return Boolean(actor.coverURL && actor.coverURL.large);
  }

  isWaiting() {
    return this.hasCover() && (!this.state.coverLoaded || this.props.isFetching);
  }

  render() {
    const {
      classes,
      isFetching,
      actor,
    } = this.props;

    const { anchorEl, coverLoaded } = this.state;

    return (
      <div className={classes.root}>
        {this.isWaiting() &&
          <LinearProgress className={classes.loader} />
        }
        <ButtonBase
          className={classes.button}
          disabled={!this.canEdit() || isFetching}
          onClick={this.handleOpen}
        >
          {this.hasCover() && coverLoaded &&
            <Fade in>
              <CardMedia
                className={classes.cover}
                title={actor.name}
                image={this.cover.src}
              />
            </Fade>
          }
          {!this.hasCover() &&
            <div className={classes.coverPlaceholder} />
          }
        </ButtonBase>
        <Menu
          id="cover-add-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem>
            <label htmlFor="selectCoverFile">
              <input
                accept="image/*"
                className={classes.input}
                id="selectCoverFile"
                type="file"
                disabled={!this.canEdit() || isFetching}
                onChange={this.handleFieldChange}
              />
              {'Upload Cover'}
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

ActorCover.propTypes = {
  classes: PropTypes.object.isRequired,
  addCover: PropTypes.func.isRequired,
  deleteCover: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
};

ActorCover.defaultProps = {
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
    addCover: (actor, file) => {
      dispatch(addCover(actor, file));
    },
    deleteCover: (actor) => {
      dispatch(deleteCover(actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorCover));
