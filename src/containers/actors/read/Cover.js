import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/cover';
import CoverForm from '../../../components/actor/CoverForm';

import ActorsType from '../../../proptypes/Actors';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import permissions from '../../../permissions/actor';

class ActorsCover extends React.Component {
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
    this.cover = new Image();
  }

  componentDidMount() {
    const { actor } = this.props;
    this.loadCover(actor);
  }

  componentWillReceiveProps(nextProps) {
    const { actor, actors } = nextProps;
    this.loadCover(actors.byId[actor.id] || actor);
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  loadCover(actor) {
    const src = actor.coverURL &&
    actor.coverURL.large &&
    actor.coverURL.large.url;

    if (!src) {
      this.setState({ isLoaded: false });
      return;
    }

    this.cover.src = src;

    this.cover.onload = () => {
      this.setState({ isLoaded: true });
    };

    this.cover.onError = () => {
      this.setState({ isLoaded: false });
    };
  }

  addCover(file) {
    const { actor, addCover } = this.props;
    addCover(actor, file);
  }

  deleteCover() {
    const { actor, deleteCover } = this.props;
    deleteCover(actor);
  }

  handleFieldChange(event) {
    const file = event.target.files[0];

    this.setState({
      anchorEl: null,
      isLoaded: false,
    });

    this.addCover(file);
  }

  handleDelete() {
    this.setState({
      anchorEl: null,
      isLoaded: false,
    });

    this.deleteCover();
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
    const cover = isLoaded ? this.cover.src : null;

    return (
      <CoverForm
        isFetching={isFetching}
        name={actor.name}
        cover={cover}
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

ActorsCover.propTypes = {
  addCover: PropTypes.func.isRequired,
  deleteCover: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
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
  } = state.cover;

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
    addCover: (actor, file) => {
      dispatch(actions.add(actor, file));
    },
    deleteCover: (actor) => {
      dispatch(actions.deleteCover(actor));
    },
    reset: () => {
      dispatch(actions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsCover);
