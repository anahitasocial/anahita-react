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

import field from '../../formfields/field';
import form from '../../utils/form';

const CommentsRead = (props) => {
  const {
    editCommentInline,
    editComment,
    parent,
    comment = { ...CommentDefault },
    isAuthenticated,
    viewer,
    inline,
    isFetching,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [currComment, setCurrComment] = useState(comment);
  const [fields, setFields] = useState({
    body: { ...field },
  });
  let oldComment = { ...CommentDefault };

  const handleCancel = () => {
    setCurrComment(oldComment);
    setIsEditing(false);
  };

  const handleEdit = () => {
    oldComment = { ...currComment };
    setIsEditing(true);
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    comment[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const { objectType } = parent;
      const namespace = objectType.split('.')[1];
      const editMethod = inline ? editCommentInline : editComment;

      editMethod(currComment, namespace).then(() => {
        setIsEditing(false);
      });
    }

    setFields({ ...newFields });
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
          fields={fields}
          comment={comment}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          handleCancel={handleCancel}
          isFetching={isFetching}
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

  const { comments, inlineComments } = state;
  const isFetching = comments.isFetching || inlineComments.isFetching;

  return {
    viewer,
    isAuthenticated,
    isFetching,
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
  isFetching: PropTypes.bool.isRequired,
};

CommentsRead.defaultProps = {
  inline: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsRead));
