import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/avatar';
import AvatarForm from '../../../components/actor/forms/Avatar';

import NodesType from '../../../proptypes/Nodes';
import NodeType from '../../../proptypes/Node';

const ActorsAvatar = (props) => {
  const {
    addAvatar,
    deleteAvatar,
    nodes,
    node,
    isFetching,
    canEdit,
  } = props;

  const getAvatarSrc = (actor) => {
    const src = actor.imageURL &&
    actor.imageURL.large &&
    actor.imageURL.large.url;

    return src || null;
  };

  const src = getAvatarSrc(node);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState(src);
  const [isLoaded, setIsLoaded] = useState(!src);

  useEffect(() => {
    if (avatar) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      image.src = avatar;

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
    addAvatar(node, files[0]).then(() => {
      const newSrc = getAvatarSrc(nodes.byId[node.id]);
      setAvatar(newSrc);
    });
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setAvatar(null);
    deleteAvatar(node);
  };

  const handleOpen = (event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AvatarForm
      isFetching={isFetching || !isLoaded}
      node={node}
      avatar={avatar}
      anchorEl={anchorEl}
      canEdit={canEdit}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleFieldChange={handleFieldChange}
      handleDelete={handleDelete}
      size="large"
    />
  );
};

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
      return dispatch(actions.add(node, file));
    },
    deleteAvatar: (node) => {
      return dispatch(actions.deleteItem(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsAvatar);
