import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import CommentRead from './Read';
import CommentForm from '../../components/comment/Form';
import Progress from '../../components/Progress';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentsType from '../../proptypes/Comments';
import CommentDefault from '../../proptypes/CommentDefault';
import PersonType from '../../proptypes/Person';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const CommentsBrowse = (props) => {
  const {
    browseComments,
    resetComments,
    addComment,
    comments,
    hasMore,
    canAdd,
    parent,
    viewer,
  } = props;

  const namespace = parent.objectType.split('.')[1];

  const [comment, setComment] = useState({
    ...CommentDefault,
    author: viewer,
    parentId: parent.id,
  });

  useEffect(() => {
    return () => {
      resetComments();
    };
  }, []);

  const fetchList = (page) => {
    const { id, objectType } = parent;
    const start = (page - 1) * LIMIT;

    browseComments({
      node: { id, objectType },
      start,
      limit: LIMIT,
    }, namespace);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setComment({ ...comment, [name]: value });
  };

  const validate = (form) => {
    const { body } = form;
    return body.checkValidity();
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const { target } = event;

    if (validate(target)) {
      addComment(comment, namespace).then(() => {
        setComment({
          ...CommentDefault,
          author: viewer,
        });
      });
    }
  };

  const hasComments = parent.numOfComments > 0;

  return (
    <React.Fragment>
      <InfiniteScroll
        loadMore={fetchList}
        hasMore={hasComments && hasMore}
        loader={
          <Progress key={`comments-progress-${parent.id}`} />
        }
      >
        {comments.allIds.map((itemId) => {
          const item = comments.byId[itemId];
          const key = `comment_${item.id}`;
          return (
            <CommentRead
              key={key}
              parent={parent}
              comment={item}
            />
          );
        })}
      </InfiniteScroll>
      {canAdd &&
        <CommentForm
          comment={comment}
          handleFieldChange={handleFieldChange}
          onSubmit={handleAdd}
        />
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;

  const {
    comments,
    error,
    hasMore,
  } = state.comments;

  return {
    viewer,
    comments,
    error,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetComments: (namespace) => {
      return dispatch(actions.comments(namespace).reset());
    },
    browseComments: (params, namespace) => {
      return dispatch(actions.comments(namespace).browse(params));
    },
    addComment: (comment, namespace) => {
      return dispatch(actions.comments(namespace).add(comment));
    },
  };
};

CommentsBrowse.propTypes = {
  comments: CommentsType.isRequired,
  parent: NodeType.isRequired,
  canAdd: PropTypes.bool,
  addComment: PropTypes.func.isRequired,
  browseComments: PropTypes.func.isRequired,
  resetComments: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
