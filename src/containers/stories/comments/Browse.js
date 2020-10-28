import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentRead from '../../comments/Read';
import CommentForm from '../../../components/comment/Form';

import actions from '../../../actions/commentsInline';

import CommentsType from '../../../proptypes/Comments';
import CommentDefault from '../../../proptypes/CommentDefault';
import NodeType from '../../../proptypes/Node';
import NodesType from '../../../proptypes/Nodes';
import PersonType from '../../../proptypes/Person';
import form from '../../../utils/form';

const formFields = form.createFormFields([
  'body',
]);

const CommentsBrowse = (props) => {
  const {
    parent,
    parents,
    canAdd,
    addItem,
    setList,
    viewer,
    isFetching,
    comments: initComments,
  } = props;

  const items = parents.byId[parent.id] || {
    allIds: [],
    byId: {},
  };

  const namespace = parent.objectType.split('.')[1];

  const [fields, setFields] = useState(formFields);

  const [comment, setComment] = useState({
    ...CommentDefault,
    author: viewer,
    parentId: parent.id,
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
      addItem(comment, namespace).then(() => {
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
    setList: (nodes, parent, namespace) => {
      return dispatch(actions(namespace).setList(nodes, parent));
    },
    addItem: (node, namespace) => {
      return dispatch(actions(namespace).add(node));
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

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
