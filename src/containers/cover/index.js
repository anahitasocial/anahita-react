import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../actions/cover';
import CoverForm from '../../components/cover/forms/Cover';

import NodesType from '../../proptypes/Nodes';
import NodeType from '../../proptypes/Node';

const Cover = (props) => {
  const {
    addCover,
    deleteCover,
    nodes,
    node,
    isFetching,
    canEdit,
  } = props;

  const getCoverSrc = (newNode) => {
    const src = newNode.coverURL &&
    newNode.coverURL.large &&
    newNode.coverURL.large.url;

    return src || null;
  };

  const src = getCoverSrc(node);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cover, setCover] = useState(src);
  const [isLoaded, setIsLoaded] = useState(!src);

  useEffect(() => {
    if (cover) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      image.src = cover;

      image.onload = () => {
        setIsLoaded(true);
      };

      image.onError = () => {
        setIsLoaded(false);
      };
    }
  }, []);

  const handleFieldChange = (event) => {
    const { files } = event.target;

    setAnchorEl(null);
    addCover(node, files[0]).then(() => {
      const newSrc = getCoverSrc(nodes.byId[node.id]);
      setCover(newSrc);
    });
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setCover(null);
    deleteCover(node);
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <CoverForm
      isFetching={isFetching || !isLoaded}
      node={node}
      cover={cover}
      anchorEl={anchorEl}
      canEdit={canEdit}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleFieldChange={handleFieldChange}
      handleDelete={handleDelete}
    />
  );
};

Cover.propTypes = {
  addCover: PropTypes.func.isRequired,
  deleteCover: PropTypes.func.isRequired,
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
  } = state.cover;

  return {
    nodes,
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCover: (node, file) => {
      return dispatch(actions.add(node, file));
    },
    deleteCover: (node) => {
      return dispatch(actions.deleteItem(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cover);
