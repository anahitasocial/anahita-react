import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';
import CommentDefault from '../../proptypes/CommentDefault';
import i18n from '../../languages';

const LikesRead = React.forwardRef((props, ref) => {
  const {
    node,
    comment,
    likeNode,
    unlikeNode,
    size,
  } = props;

  const [liked, setLiked] = useState(comment.isVotedUp);

  const handleLike = () => {
    setLiked(true);
    likeNode(node, comment);
  };

  const handleUnlike = () => {
    setLiked(false);
    unlikeNode(node, comment);
  };

  const label = liked ? i18n.t('actions:unlike') : i18n.t('actions:like');
  const onClick = liked ? handleUnlike : handleLike;
  const color = liked ? 'primary' : 'inherit';

  return (
    <IconButton
      onClick={onClick}
      color={color}
      aria-label={label}
      ref={ref}
    >
      {liked &&
        <UnlikeIcon fontSize={size} />
      }
      {!liked &&
        <LikeIcon fontSize={size} />
      }
    </IconButton>
  );
});

LikesRead.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  comment: CommentType,
  size: PropTypes.oneOf(['small', 'default', 'large', 'inherit']),
};

LikesRead.defaultProps = {
  comment: CommentDefault,
  size: 'default',
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
    } = state[namespace];

    return {
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      likeNode: (node, comment = CommentDefault) => {
        return dispatch(actions.comments(namespace).likes.add(node, comment));
      },
      unlikeNode: (node, comment = CommentDefault) => {
        return dispatch(actions.comments(namespace).likes.deleteItem(node, comment));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(LikesRead);
};
