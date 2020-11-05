import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import * as actions from '../../../actions';
import NodeType from '../../../proptypes/Node';
import StoryType from '../../../proptypes/Story';
import i18n from '../../../languages';

const LikesActionLikeStory = React.forwardRef((props, ref) => {
  const {
    story,
    node,
    likeNode,
    unlikeNode,
    size,
  } = props;

  const [liked, setLiked] = useState(node.isVotedUp);

  const handleLike = () => {
    setLiked(true);
    likeNode(story, node);
  };

  const handleUnlike = () => {
    setLiked(false);
    unlikeNode(story, node);
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

LikesActionLikeStory.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  story: StoryType.isRequired,
  node: NodeType.isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large', 'inherit']),
};

LikesActionLikeStory.defaultProps = {
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
      likeNode: (story, node) => {
        return dispatch(actions[namespace].likes.add(story, node));
      },
      unlikeNode: (story, node) => {
        return dispatch(actions[namespace].likes.deleteItem(story, node));
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
