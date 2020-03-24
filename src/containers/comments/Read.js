import React, { useState } from 'react';
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
import CommentDefault from '../../proptypes/CommentDefault';

const CommentsRead = (props) => {
  const {
    editCommentInline,
    editComment,
    parent,
    comment,
    isAuthenticated,
    viewer,
    inline,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [currComment, setCurrComment] = useState(comment);
  let oldComment = { ...CommentDefault };

  const handleCancel = () => {
    setCurrComment(oldComment);
    setIsEditing(false);
  };

  const handleEdit = () => {
    oldComment = { ...currComment };
    setIsEditing(true);
  };

  const validate = (form) => {
    const { body } = form;
    return body.checkValidity();
  };

  const handleSave = (event) => {
    event.preventDefault();
    const { target } = event;

    if (validate(target)) {
      const { objectType } = parent;
      const namespace = objectType.split('.')[1];
      const editMethod = inline ? editCommentInline : editComment;

      editMethod(currComment, namespace).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setCurrComment({ ...currComment, [name]: value });
  };

  return (
    <CommentCard
      comment={comment}
      menu={isAuthenticated &&
        <CommentMenu
          node={parent}
          comment={comment}
          viewer={viewer}
          handleEdit={handleEdit}
          inline={inline}
        />
      }
      actions={[
        <LikeAction
          node={parent}
          comment={comment}
          liked={comment.isVotedUp}
          key={`comment-like-${comment.id}`}
          size="small"
        />,
      ]}
      commentForm={
        <CommentForm
          comment={currComment}
          handleFieldChange={handleFieldChange}
          handleCancel={handleCancel}
          onSubmit={handleSave}
        />
      }
      isEditing={isEditing}
    />
  );
};

const mapStateToProps = (state) => {
  const {
    viewer,
    isAuthenticated,
  } = state.session;

  return {
    viewer,
    isAuthenticated,
  };
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
  editCommentInline: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
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
