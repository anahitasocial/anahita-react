import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../../actions';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const LikesActionLikeStory = React.forwardRef(({
  repostNode,
  node,
  likeNode,
  unlikeNode = null,
  size = 'medium',
}, ref) => {
  const likeableNode = node;
  const { isLikedByViewer: liked } = likeableNode;

  const handleLike = () => {
    likeNode(repostNode, node);
  };

  const handleUnlike = () => {
    unlikeNode(repostNode, node);
  };

  const label = liked ? i18n.t('actions:unlike') : i18n.t('actions:like');
  const onClick = liked ? handleUnlike : handleLike;
  const color = liked ? 'primary' : 'inherit';

  return (
    <Button
      onClick={onClick}
      color={color}
      aria-label={label}
      ref={ref}
      startIcon={
        <>
          {liked && <UnlikeIcon fontSize={size} />}
          {!liked && <LikeIcon fontSize={size} />}
        </>
      }
      fullWidth
    >
      {node.likesCount > 0 && node.likesCount}
    </Button>
  );
});

LikesActionLikeStory.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  repostNode: NodeType,
  node: NodeType.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'inherit']),
};

const mapStateToProps = () => {
  return () => {
    return {};
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      likeNode: (child, node) => {
        return dispatch(actions[namespace].likes.add({ child, node }));
      },
      unlikeNode: (child, node) => {
        return dispatch(actions[namespace].likes.deleteItem({ child, node }));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(LikesActionLikeStory);
};
