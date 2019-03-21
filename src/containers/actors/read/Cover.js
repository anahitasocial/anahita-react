import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/cover';
import CoverForm from '../../../components/actor/CoverForm';

import NodesType from '../../../proptypes/Nodes';
import NodeType from '../../../proptypes/Node';

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
    const { node } = this.props;
    this.loadCover(node);
  }

  componentWillReceiveProps(nextProps) {
    const { node, nodes } = nextProps;
    this.loadCover(nodes.byId[node.id] || node);
  }

  loadCover(node) {
    const src = node.coverURL &&
    node.coverURL.large &&
    node.coverURL.large.url;

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
    const { node, addCover } = this.props;
    addCover(node, file);
  }

  deleteCover() {
    const { node, deleteCover } = this.props;
    deleteCover(node);
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
      node,
      canEdit,
    } = this.props;

    const {
      anchorEl,
      isLoaded,
    } = this.state;

    const cover = isLoaded ? this.cover.src : null;

    // console.log('----');
    // console.log('cover', cover);
    // console.log('isFetching', isFetching);

    return (
      <CoverForm
        isFetching={isFetching}
        name={node.name}
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
  nodes: NodesType.isRequired,
  node: NodeType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.auth;

  const {
    nodes,
    isFetching,
    success,
    error,
  } = state.cover;

  return {
    nodes,
    isFetching,
    success,
    error,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCover: (node, file) => {
      dispatch(actions.add(node, file));
    },
    deleteCover: (node) => {
      dispatch(actions.deleteCover(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsCover);
