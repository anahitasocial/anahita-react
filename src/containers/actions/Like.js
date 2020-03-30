import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../actions/likes';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';
import CommentDefault from '../../proptypes/CommentDefault';
import i18n from '../../languages';

const ActionLike = React.forwardRef((props, ref) => {
  const {
    node,
    comment,
    likeNode,
    unlikeNode,
    liked,
    size,
  } = props;

  const [isLiked, setIsLiked] = React.useState(liked);
  const [isWaiting, setIsWaiting] = React.useState(false);

  const handleLike = (event) => {
    event.preventDefault();

    setIsWaiting(true);

    likeNode(node, comment).then(() => {
      setIsLiked(true);
      setIsWaiting(false);
    });
  };

  const handleUnlike = (event) => {
    event.preventDefault();

    setIsWaiting(true);

    unlikeNode(node, comment).then(() => {
      setIsLiked(false);
      setIsWaiting(false);
    });
  };

  const label = isLiked ? i18n.t('actions:unlike') : i18n.t('actions:like');
  const onClick = isLiked ? handleUnlike : handleLike;
  const color = isLiked ? 'primary' : 'inherit';

  return (
    <IconButton
      onClick={onClick}
      disabled={isWaiting}
      color={color}
      aria-label={label}
      ref={ref}
    >
      {isLiked &&
        <UnlikeIcon fontSize={size} />
      }
      {!isLiked &&
        <LikeIcon fontSize={size} />
      }
    </IconButton>
  );
});

ActionLike.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  comment: CommentType,
  liked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large', 'inherit']),
};

ActionLike.defaultProps = {
  liked: false,
  comment: CommentDefault,
  size: 'default',
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    likeNode: (node, comment = CommentDefault) => {
      return dispatch(actions.add(node, comment));
    },
    unlikeNode: (node, comment = CommentDefault) => {
      return dispatch(actions.deleteItem(node, comment));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionLike);
