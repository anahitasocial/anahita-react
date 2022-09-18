import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../../actions';
import NodeType from '../../../proptypes/Node';
import CommentType from '../../../proptypes/Comment';
import CommentDefault from '../../../proptypes/CommentDefault';
import i18n from '../../../languages';

const LikesActionLikeComment = React.forwardRef((props, ref) => {
  const {
    node,
    comment,
    likeNode,
    unlikeNode,
    size,
  } = props;

  const { isVotedUp: liked } = comment;

  const handleLike = () => {
    likeNode(node, comment);
  };

  const handleUnlike = () => {
    unlikeNode(node, comment);
  };

  const label = liked ? i18n.t('actions:unlike') : i18n.t('actions:like');
  const onClick = liked ? handleUnlike : handleLike;
  const color = liked ? 'primary' : 'inherit';

  return (
    <Button
      size="small"
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
      Like
    </Button>
  );
});

LikesActionLikeComment.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  comment: CommentType,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'inherit']),
};

LikesActionLikeComment.defaultProps = {
  comment: CommentDefault,
  size: 'medium',
};

const mapStateToProps = () => {
  return () => {
    return {};
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      likeNode: (node, comment = CommentDefault) => {
        return dispatch(actions.comments(namespace).likes.add({ node, comment }));
      },
      unlikeNode: (node, comment = CommentDefault) => {
        return dispatch(actions.comments(namespace).likes.deleteItem({ node, comment }));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(LikesActionLikeComment);
};
