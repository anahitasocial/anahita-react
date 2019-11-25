import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentCard from '../../components/cards/Comment';
import CommentForm from '../../components/comment/Form';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';
import PersonType from '../../proptypes/Person';

import LikeAction from '../actions/Like';
import CommentMenu from './Menu';
import i18n from '../../languages';
import { Comments as COMMENT } from '../../constants';

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
    const {
      parent: { objectType },
      inline,
    } = this.props;

    const { comment } = this.state;

    if (this.validate()) {
      const namespace = objectType.split('.')[1];
      const editMethod = inline ? 'editCommentInline' : 'editComment';
      this.props[editMethod](comment, namespace).then(() => {
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

    const { BODY } = COMMENT.FIELDS;

    if (name === 'body') {
      if (value.length === 0 || value.length > BODY.MAX_LENGTH) {
        fieldError.error = true;
        fieldError.helperText = i18n.t('comments:comment.bodyErrorHelperText', {
          max: BODY.MAX_LENGTH,
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
      inline,
      isAuthenticated,
    } = this.props;

    return (
      <CommentCard
        comment={comment}
        menu={isAuthenticated &&
          <CommentMenu
            node={parent}
            comment={comment}
            viewer={viewer}
            handleEdit={this.handleEdit}
            inline={inline}
          />
        }
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
  const { viewer, isAuthenticated } = state.session;
  return { viewer, isAuthenticated };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editComment: (comment, namespace) => {
      return dispatch(actions.comments(namespace).edit(comment));
    },
    editCommentInline: (comment, namespace) => {
      return dispatch(actions.inlineComments(namespace).edit(comment));
    },
  };
};

CommentsRead.propTypes = {
  parent: NodeType.isRequired,
  comment: CommentType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  inline: PropTypes.bool,
};

CommentsRead.defaultProps = {
  inline: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsRead));
