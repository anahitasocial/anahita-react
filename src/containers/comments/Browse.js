import React from 'react';
import PropTypes from 'prop-types';
import CommentCard from '../../components/cards/Comment';
import NodeType from '../../proptypes/Node';
import CommentsType from '../../proptypes/Comments';
import LikeAction from '../actions/node/Like';

class CommentsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comments: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
  }

  componentWillMount() {
    const { comments } = this.props;
    this.setState({ comments });
  }

  componentWillReceiveProps(nextProps) {
    const { comments } = nextProps;
    this.setState({ comments });
  }

  render() {
    const { comments } = this.state;
    const { canAdd, node } = this.props;
    return (
      <React.Fragment>
        {comments.allIds.map((commentId) => {
          const comment = comments.byId[commentId];
          const key = `comment_${comment.id}`;
          return (
            <CommentCard
              comment={comment}
              key={key}
              actions={[
                <LikeAction
                  node={node}
                  comment={comment}
                  isLiked={comment.isVotedUp}
                  key={`comment-like-${comment.id}`}
                  size="small"
                />,
              ]}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

CommentsBrowse.propTypes = {
  node: NodeType.isRequired,
  comments: CommentsType.isRequired,
  canAdd: PropTypes.bool,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default CommentsBrowse;
