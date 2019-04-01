import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import CommentCard from '../../components/cards/Comment';
import EntityBody from '../../components/EntityBody';
import CommentsType from '../../proptypes/Comments';

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
    const { canAdd } = this.props;
    return (
      <React.Fragment>
        {comments.allIds.map((commentId) => {
          const comment = comments.byId[commentId];
          const key = `comment_${comment.id}`;
          return (
            <CommentCard
              comment={comment}
              key={key}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

CommentsBrowse.propTypes = {
  comments: CommentsType.isRequired,
  canAdd: PropTypes.bool,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default CommentsBrowse;
