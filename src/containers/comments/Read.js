import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentItem from '../../components/comment/CommentItem';
import CommentForm from '../../components/comment/Form';

import actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';
import PersonType from '../../proptypes/Person';

import Likes from '../likes';

import ActionLikeComment from '../likes/actions/LikeComment';
import ActionLikeCommentInline from '../likes/actions/LikeCommentInline';
import CommentMenu from './Menu';
import CommentDefault from '../../proptypes/CommentDefault';
import utils from '../../utils';

const { form } = utils;

const formFields = form.createFormFields([
  'body',
]);

const CommentsRead = (props) => {
  const {
    editItemInline,
    editItem,
    parent,
    comment = { ...CommentDefault },
    isAuthenticated,
    viewer,
    inline,
    isFetching,
  } = props;

  const [oldBody, setOldBody] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);

  const handleCancel = () => {
    comment.body = oldBody;
    setIsEditing(false);
  };

  const handleEdit = () => {
    setOldBody(comment.body);
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
      const namespace = utils.node.getNamespace(parent);
      const editMethod = inline ? editItemInline : editItem;

      editMethod(comment, namespace).then(() => {
        setIsEditing(false);
      });
    }

    setFields({ ...newFields });
  };

  const commentObjectType = utils.node.getNamespace(comment);
  const Like = inline ?
    ActionLikeCommentInline(commentObjectType) :
    ActionLikeComment(commentObjectType);

  return (
    <CommentItem
      comment={comment}
      menu={isAuthenticated &&
        <CommentMenu
          node={parent}
          comment={comment}
          viewer={viewer}
          handleEdit={handleEdit}
          inline={inline}
        />}
      stats={<Likes node={parent} comment={comment} />}
      actions={isAuthenticated && <Like
        node={parent}
        comment={comment}
        key={`comment-like-${comment.id}`}
        size="small"
      />}
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

  const { comments, commentsInline } = state;
  const isFetching = comments.isFetching || commentsInline.isFetching;

  return {
    viewer,
    isAuthenticated,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editItem: (node, namespace) => {
      return dispatch(actions.comments(namespace).edit(node));
    },
    editItemInline: (node, namespace) => {
      return dispatch(actions.commentsInline(namespace).edit(node));
    },
  };
};

CommentsRead.propTypes = {
  editItemInline: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
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
