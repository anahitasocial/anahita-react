import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentCard from '../../components/cards/Comment';
import CommentForm from '../../components/comment/Form';

import actions from '../../actions/comments';
import NodeType from '../../proptypes/Node';
import CommentsType from '../../proptypes/Comments';
import CommentDefault from '../../proptypes/CommentDefault';
import PersonType from '../../proptypes/Person';
import LikeAction from '../actions/node/Like';
import FollowAction from '../actions/Follow';
import BlockAction from '../actions/Block';
import i18n from '../../languages';

const MAX_CHAR_LIMIT = 5000;

class CommentsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comment: { ...CommentDefault },
      bodyError: false,
      bodyHelperText: i18n.t('comments:comment.bodyHelperText'),
      comments: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;

    this.handleAdd = this.handleAdd.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentWillMount() {
    const { comments } = this.props;
    this.setState({ comments });
  }

  componentWillReceiveProps(nextProps) {
    const { comments } = nextProps;
    this.setState({ comments });
  }

  handleAdd() {
    const { node, addComment } = this.props;
    const { comment } = this.state;
    if (this.validate()) {
      addComment(comment, node);
    }
  }

  handleFieldChange(event) {
    const { comment } = this.state;
    const { target } = event;
    const { name, value } = target;

    this.validateField(name, value);
    comment[name] = value;

    this.setState({ comment });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    if (name === 'body') {
      if (value.length === 0 || value.length > MAX_CHAR_LIMIT) {
        fieldError.error = true;
        fieldError.helperText = i18n.t('comments:comment.bodyErrorHelperText', {
          max: MAX_CHAR_LIMIT,
        });
      }
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const {
      comment: {
        body,
      },
    } = this.state;

    const bodyValidate = this.validateField('body', body);

    return bodyValidate;
  }

  render() {
    const {
      comments,
      comment,
      bodyError,
      bodyHelperText,
    } = this.state;

    const { canAdd, node, viewer } = this.props;

    return (
      <React.Fragment>
        {comments.allIds.map((itemId) => {
          const item = comments.byId[itemId];
          const key = `comment_${item.id}`;
          const { author } = item;
          return (
            <CommentCard
              comment={comment}
              key={key}
              menuItems={[
                author.id !== viewer.id &&
                <FollowAction
                  actor={author}
                  component="menuitem"
                  key={`comment-follow-${comment.id}`}
                  followLabel={i18n.t('comments:actions.followAuthor', {
                    name: author.name,
                  })}
                  unfollowLabel={i18n.t('comments:actions.unfollowAuthor', {
                    name: author.name,
                  })}
                />,
                author.id !== viewer.id &&
                <BlockAction
                  actor={author}
                  component="menuitem"
                  key={`comment-block-${comment.id}`}
                  blockLabel={i18n.t('comments:actions.blockAuthor', {
                    name: author.name,
                  })}
                  unblockLabel={i18n.t('comments:actions.unblockAuthor', {
                    name: author.name,
                  })}
                />,
              ]}
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
        {canAdd &&
          <CommentForm
            comment={comment}
            // disabled
            handleFieldChange={this.handleFieldChange}
            handleAdd={this.handleAdd}
            bodyError={bodyError}
            bodyHelperText={bodyHelperText}
          />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { viewer } = state.auth;

  const {
    comments,
    error,
    isFetching,
  } = state.comments;

  return {
    viewer,
    comments,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addComment: (comment, node) => {
      dispatch(actions.add(comment, node));
    },
  };
};

CommentsBrowse.propTypes = {
  node: NodeType.isRequired,
  comments: CommentsType.isRequired,
  canAdd: PropTypes.bool,
  viewer: PersonType.isRequired,
  addComment: PropTypes.func.isRequired,
  // isFetching: PropTypes.bool.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
