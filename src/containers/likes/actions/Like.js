import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import * as actions from '../../../actions';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const LikesActionLike = React.forwardRef((props, ref) => {
  const {
    node,
    likeNode,
    unlikeNode,
    size,
  } = props;

  const [liked, setLiked] = useState(node.isVotedUp);

  const handleLike = () => {
    setLiked(true);
    likeNode(node);
  };

  const handleUnlike = () => {
    setLiked(false);
    unlikeNode(node);
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

LikesActionLike.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large', 'inherit']),
};

LikesActionLike.defaultProps = {
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
      likeNode: (node) => {
        return dispatch(actions[namespace].likes.add(node));
      },
      unlikeNode: (node) => {
        return dispatch(actions[namespace].likes.deleteItem(node));
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