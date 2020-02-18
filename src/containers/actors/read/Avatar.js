import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/avatar';
import AvatarForm from '../../../components/actor/forms/Avatar';

import NodesType from '../../../proptypes/Nodes';
import NodeType from '../../../proptypes/Node';

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
    this.hasAvatar = false;
  }

  componentDidMount() {
    const { node } = this.props;
    this.loadAvatar(node);
  }

  componentWillReceiveProps(nextProps) {
    const { node, nodes } = nextProps;
    this.loadAvatar(nodes.byId[node.id] || node);
  }

  loadAvatar(actor) {
    const src = actor.imageURL &&
    actor.imageURL.large &&
    actor.imageURL.large.url;

    if (!src) {
      this.setState({ isLoaded: false });
      this.hasAvatar = false;
      return;
    }

    this.avatar.src = src;
    this.hasAvatar = true;

    this.avatar.onload = () => {
      this.setState({ isLoaded: true });
    };

    this.avatar.onError = () => {
      this.setState({ isLoaded: false });
    };
  }

  addAvatar(file) {
    const { node, addAvatar } = this.props;
    addAvatar(node, file);
  }

  deleteAvatar() {
    const { node, deleteAvatar } = this.props;
    deleteAvatar(node);
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
      node,
      canEdit,
    } = this.props;

    const {
      anchorEl,
      isLoaded,
    } = this.state;

    const avatar = isLoaded ? this.avatar.src : null;

    return (
      <AvatarForm
        isFetching={isFetching || (this.hasAvatar && !isLoaded)}
        node={node}
        avatar={avatar}
        anchorEl={anchorEl}
        canEdit={canEdit}
        handleOpen={this.handleOpen}
        handleClose={this.handleClose}
        handleFieldChange={this.handleFieldChange}
        handleDelete={this.handleDelete}
        size="large"
      />
    );
  }
}

ActorsAvatar.propTypes = {
  addAvatar: PropTypes.func.isRequired,
  deleteAvatar: PropTypes.func.isRequired,
  nodes: NodesType.isRequired,
  node: NodeType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    nodes,
    isFetching,
    success,
    error,
  } = state.avatar;

  return {
    nodes,
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAvatar: (node, file) => {
      dispatch(actions.add(node, file));
    },
    deleteAvatar: (node) => {
      dispatch(actions.deleteItem(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsAvatar);
