import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import CommentCard from '../../components/cards/Comment';
import CommentForm from '../../components/comment/Form';

import actions from '../../actions/comments';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';
import PersonType from '../../proptypes/Person';

import LikeAction from '../actions/node/Like';
import FollowAction from '../actions/Follow';
import BlockAction from '../actions/Block';
import DeleteAction from '../actions/comment/Delete';
import i18n from '../../languages';

const MAX_CHAR_LIMIT = 5000;

class CommentsRead extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { comment } = props;

    this.state = {
      isEditing: false,
      comment,
      bodyError: false,
      bodyHelperText: '',
    };

    this.oldComment = null;
    this.offset = 0;
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { comment } = nextProps;
    return { comment };
  }

  handleCancel() {
    this.setState({
      comment: this.oldComment,
      isEditing: false,
    });
  }

  handleEdit() {
    const { comment } = this.state;
    this.oldComment = { ...comment };
    this.setState({ isEditing: true });
  }

  handleSave() {
    const { parent, editComment } = this.props;
    const { comment } = this.state;
    if (this.validate()) {
      editComment(comment, parent).then(() => {
        this.setState({
          isEditing: false,
        });
      });
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
      comment,
      bodyError,
      bodyHelperText,
      isEditing,
    } = this.state;

    const {
      parent,
      viewer,
    } = this.props;

    const canEdit = Boolean(comment.authorized.edit);
    const canDelete = Boolean(comment.authorized.delete);
    const { author } = comment;

    return (
      <CommentCard
        comment={comment}
        menuItems={[
          canEdit &&
            <MenuItem
              onClick={this.handleEdit}
              key={`comment-edit-${comment.id}`}
            >
              {i18n.t('actions:edit')}
            </MenuItem>,
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
          canDelete &&
          <DeleteAction
            node={parent}
            comment={comment}
            key={`comment-delete-${comment.id}`}
          />,
        ]}
        actions={[
          <LikeAction
            node={parent}
            comment={comment}
            isLiked={comment.isVotedUp}
            key={`comment-like-${comment.id}`}
            size="small"
          />,
        ]}
        commentForm={
          <CommentForm
            comment={comment}
            handleFieldChange={this.handleFieldChange}
            handleSave={this.handleSave}
            handleCancel={this.handleCancel}
            bodyError={bodyError}
            bodyHelperText={bodyHelperText}
          />
        }
        isEditing={isEditing}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { viewer } = state.session;

  return {
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editComment: (comment, node) => {
      return dispatch(actions.edit(comment, node));
    },
  };
};

CommentsRead.propTypes = {
  parent: NodeType.isRequired,
  comment: CommentType.isRequired,
  viewer: PersonType.isRequired,
  editComment: PropTypes.func.isRequired,
  // isFetching: PropTypes.bool.isRequired,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsRead));
