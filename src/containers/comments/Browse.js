import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import Card from '@material-ui/core/Card';
import CommentRead from './Read';
import CommentForm from '../../components/comment/Form';
import Progress from '../../components/Progress';

import actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentsType from '../../proptypes/Comments';
import CommentDefault from '../../proptypes/CommentDefault';
import PersonType from '../../proptypes/Person';
import { App as APP } from '../../constants';
import utils from '../../utils';

const { form } = utils;
const { LIMIT } = APP.BROWSE;
const formFields = form.createFormFields([
  'body',
]);

const CommentsBrowse = (props) => {
  const {
    browseList,
    resetList,
    addItem,
    items,
    canAdd,
    parent,
    viewer,
    isFetching,
    cardProps,
    total,
  } = props;

  const namespace = utils.node.getNamespace(parent);

  const { id, objectType } = parent;

  const [start, setStart] = useState(0);
  const [fields, setFields] = useState(formFields);

  const [comment, setComment] = useState({
    ...CommentDefault,
    author: viewer,
    parentId: parent.id,
  });

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    browseList({
      node: { id, objectType },
      start,
      limit: LIMIT,
      sort: 'oldest',
    });
  }, [id, objectType, start]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

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
            parentId: parent.id,
          });
        });
    }

    setFields({ ...newFields });
  };

  const hasMore = total > items.allIds.length;

  return (
    <Card>
      <InfiniteScroll
        dataLength={items.allIds.length}
        next={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key={`${namespace}-progress`} />
        }
      >
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `comment_node_${node.id}`;
          return (
            <CommentRead
              key={key}
              parent={parent}
              comment={node}
            />
          );
        })}
      </InfiniteScroll>
      {canAdd &&
        <CommentForm
          fields={fields}
          comment={comment}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
          cardProps={cardProps}
        />}
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;

  const {
    comments: items,
    error,
    isFetching,
    total,
  } = state.comments;

  return {
    viewer,
    items,
    error,
    isFetching,
    total,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.comments.browse(params));
    },
    resetList: () => {
      return dispatch(actions.comments.reset());
    },
    addItem: (node) => {
      return dispatch(actions.comments.add(node));
    },
  };
};

CommentsBrowse.propTypes = {
  items: CommentsType.isRequired,
  parent: NodeType.isRequired,
  canAdd: PropTypes.bool,
  addItem: PropTypes.func.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  cardProps: PropTypes.objectOf(PropTypes.any),
  total: PropTypes.number,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
  cardProps: {},
  total: 0,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
