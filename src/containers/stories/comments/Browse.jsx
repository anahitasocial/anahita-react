import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentRead from '../../comments/Read';
import CommentForm from '../components/Comment';

import actions from '../../../actions';

import CommentsType from '../../../proptypes/Comments';
import CommentDefault from '../../../proptypes/CommentDefault';
import NodeType from '../../../proptypes/Node';
import NodesType from '../../../proptypes/Nodes';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';

const { form } = utils;

const formFields = form.createFormFields([
  'body',
]);

const CommentsBrowse = ({
  parent,
  parents,
  canAdd = false,
  addItem,
  setList,
  viewer,
  isFetching,
  comments: initComments,
}) => {
  const items = parents.byId[parent.id] || {
    allIds: [],
    byId: {},
  };

  const namespace = utils.node.getNamespace(parent);

  const [fields, setFields] = useState(formFields);
  const [comment, setComment] = useState({
    ...CommentDefault,
    author: viewer,
    parent,
  });

  useEffect(() => {
    setList(initComments, parent, namespace);
  }, [initComments, parent, namespace]);

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
      addItem(comment)
        .then(() => {
          setComment({
            ...CommentDefault,
            author: viewer,
            parent,
          });
        });
    }

    setFields({ ...newFields });
  };

  return (
    <>
      {items.allIds.map((itemId) => {
        const node = items.byId[itemId];
        const key = `comment_list_item_${node.id}`;
        return (
          <CommentRead
            key={key}
            parent={parent}
            comment={node}
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
        />}
    </>
  );
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;

  const {
    parents,
    error,
    isFetching,
  } = state.commentsInline;

  return {
    viewer,
    parents,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setList: (nodes, parent) => {
      return dispatch(actions.commentsInline.setList(nodes, parent));
    },
    addItem: (comment) => {
      return dispatch(actions.commentsInline.add(comment));
    },
  };
};

CommentsBrowse.propTypes = {
  parent: NodeType.isRequired,
  parents: NodesType.isRequired,
  comments: CommentsType.isRequired,
  canAdd: PropTypes.bool,
  setList: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
