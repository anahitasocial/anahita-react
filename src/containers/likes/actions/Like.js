import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../../actions';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const LikesActionLike = React.forwardRef((props, ref) => {
  const {
    node,
    likeNode,
    unlikeNode,
    size,
  } = props;

  const { isVotedUp: liked } = node;

  const handleLike = () => {
    likeNode(node);
  };

  const handleUnlike = () => {
    unlikeNode(node);
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
      Like
    </Button>
  );
});

LikesActionLike.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'inherit']),
};

LikesActionLike.defaultProps = {
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
      likeNode: (node) => {
        return dispatch(actions[namespace].likes.add({ node }));
      },
      unlikeNode: (node) => {
        return dispatch(actions[namespace].likes.deleteItem({ node }));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(LikesActionLike);
};
