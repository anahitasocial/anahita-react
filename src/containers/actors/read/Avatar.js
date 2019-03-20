import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/avatar';
import AvatarForm from '../../../components/actor/AvatarForm';

import ActorsType from '../../../proptypes/Actors';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import permissions from '../../../permissions/actor';

class ActorsAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      isLoaded: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    /* global Image */
    this.avatar = new Image();
  }

  componentDidMount() {
    const { actor } = this.props;
    this.loadAvatar(actor);
  }

  componentWillReceiveProps(nextProps) {
    const { actor, actors } = nextProps;
    this.loadAvatar(actors.byId[actor.id] || actor);
  }

  loadAvatar(actor) {
    const src = actor.imageURL &&
    actor.imageURL.large &&
    actor.imageURL.large.url;

    if (!src) {
      this.setState({ isLoaded: false });
      return;
    }

    this.avatar.src = src;

    this.avatar.onload = () => {
      this.setState({ isLoaded: true });
    };

    this.avatar.onError = () => {
      this.setState({ isLoaded: false });
    };
  }

  addAvatar(file) {
    const { actor, addAvatar } = this.props;
    addAvatar(actor, file);
  }

  deleteAvatar() {
    const { actor, deleteAvatar } = this.props;
    deleteAvatar(actor);
  }

  handleFieldChange(event) {
    const file = event.target.files[0];

    this.setState({
      anchorEl: null,
      isLoaded: false,
    });

    this.addAvatar(file);
  }

  handleDelete() {
    this.setState({
      anchorEl: null,
      isLoaded: false,
    });

    this.deleteAvatar();
  }

  handleOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const {
      isFetching,
      actor,
      viewer,
    } = this.props;

    const {
      anchorEl,
      isLoaded,
    } = this.state;

    const canEdit = permissions.canEdit(viewer, actor);
    const avatar = isLoaded ? this.avatar.src : null;

    return (
      <AvatarForm
        isFetching={isFetching}
        name={actor.name}
        avatar={avatar}
        anchorEl={anchorEl}
        canEdit={canEdit}
        handleOpen={this.handleOpen}
        handleClose={this.handleClose}
        handleFieldChange={this.handleFieldChange}
        handleDelete={this.handleDelete}
      />
    );
  }
}

ActorsAvatar.propTypes = {
  addAvatar: PropTypes.func.isRequired,
  deleteAvatar: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.auth;

  const {
    actors,
    isFetching,
    success,
    error,
  } = state.avatar;

  return {
    actors,
    isFetching,
    success,
    error,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAvatar: (actor, file) => {
      dispatch(actions.add(actor, file));
    },
    deleteAvatar: (actor) => {
      dispatch(actions.deleteAvatar(actor));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsAvatar);
