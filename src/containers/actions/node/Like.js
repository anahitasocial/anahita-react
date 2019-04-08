import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../../actions/likes';
import NodeType from '../../../proptypes/Node';
import CommentType from '../../../proptypes/Comment';
import CommentDefault from '../../../proptypes/CommentDefault';
import i18n from '../../../languages';

class LikeAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      isFetching: false,
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentWillMount() {
    const { isLiked } = this.props;
    this.setState({ isLiked });
  }

  componentWillReceiveProps() {
    this.setState({ isFetching: false });
  }

  handleLike(event) {
    event.preventDefault();

    const { node, comment, likeNode } = this.props;

    likeNode(node, comment);

    this.setState({ isLiked: true });
  }

  handleUnlike(event) {
    event.preventDefault();

    const { node, comment, unlikeNode } = this.props;

    unlikeNode(node, comment);

    this.setState({ isLiked: false });
  }

  render() {
    const { size } = this.props;
    const { isLiked, isFetching } = this.state;
    const label = isLiked ? i18n.t('actions:unlike') : i18n.t('actions:like');
    const onClick = isLiked ? this.handleUnlike : this.handleLike;
    const color = isLiked ? 'primary' : 'inherit';

    return (
      <IconButton
        onClick={onClick}
        disabled={isFetching}
        color={color}
        aria-label={label}
      >
        {isLiked &&
          <UnlikeIcon fontSize={size} />
        }
        {!isLiked &&
          <LikeIcon fontSize={size} />
        }
      </IconButton>
    );
  }
}

LikeAction.propTypes = {
  likeNode: PropTypes.func.isRequired,
  unlikeNode: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  comment: CommentType,
  isLiked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

LikeAction.defaultProps = {
  isLiked: false,
  comment: CommentDefault,
  size: 'medium',
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    likeNode: (node, comment = CommentDefault) => {
      dispatch(actions.add(node, comment));
    },
    unlikeNode: (node, comment = CommentDefault) => {
      dispatch(actions.deleteItem(node, comment));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LikeAction);
