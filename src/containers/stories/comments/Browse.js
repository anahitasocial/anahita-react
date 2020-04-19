import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentRead from '../../comments/Read';
import CommentForm from '../../../components/comment/Form';

import actions from '../../../actions/inline_comments';

import CommentsType from '../../../proptypes/Comments';
import CommentDefault from '../../../proptypes/CommentDefault';
import NodeType from '../../../proptypes/Node';
import NodesType from '../../../proptypes/Nodes';
import PersonType from '../../../proptypes/Person';
import field from '../../../formfields/field';
import form from '../../../utils/form';

const CommentsBrowse = (props) => {
  const {
    parent,
    parents,
    canAdd,
    addComment,
    setComments,
    viewer,
    isFetching,
  } = props;

  const comments = parents.byId[parent.id] || {
    allIds: [],
    byId: {},
  };

  const namespace = parent.objectType.split('.')[1];

  const [fields, setFields] = useState({
    body: { ...field },
  });

  const [comment, setComment] = useState({
    ...CommentDefault,
    author: viewer,
    parentId: parent.id,
  });

  useEffect(() => {
    setComments(props.comments, parent, namespace);
  }, []);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    comment[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
    setComment({ ...comment });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      addComment(comment, namespace).then(() => {
        setComment({
          ...CommentDefault,
          author: viewer,
          parentId: parent.id,
        });
      });
    }

    setFields({ ...newFields });
  };

  return (
    <React.Fragment>
      {comments.allIds.map((itemId) => {
        const item = comments.byId[itemId];
        const key = `comment-${item.id}`;
        return (
          <CommentRead
            key={key}
            parent={parent}
            comment={item}
            inline
          />
        );
      })}
      {canAdd &&
        <CommentForm
          fields={fields}
          comment={comment}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
        />
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;

  const {
    parents,
    error,
    isFetching,
  } = state.inlineComments;

  return {
    viewer,
    parents,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setComments: (comments, parent, namespace) => {
      return dispatch(actions(namespace).setList(comments, parent));
    },
    addComment: (comment, namespace) => {
      return dispatch(actions(namespace).add(comment));
    },
  };
};

CommentsBrowse.propTypes = {
  parent: NodeType.isRequired,
  parents: NodesType.isRequired,
  comments: CommentsType.isRequired,
  canAdd: PropTypes.bool,
  setComments: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
