import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import CommentRead from './Read';
import CommentForm from '../../components/comment/Form';
import Progress from '../../components/Progress';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import CommentDefault from '../../proptypes/CommentDefault';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';
import {
  App as APP,
  Comments as COMMENT,
} from '../../constants';

class CommentsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      comments: {
        byId: {},
        allIds: [],
      },
      comment: {
        ...CommentDefault,
        author: props.viewer,
      },
      bodyError: false,
      bodyHelperText: '',
      hasMore: true,
    };

    this.offset = 0;
    this.handleAdd = this.handleAdd.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { comments, hasMore } = nextProps;
    return { comments, hasMore };
  }

  componentWillUnmount() {
    const { resetComments } = this.props;
    resetComments();
  }

  fetchComments() {
    const {
      parent: {
        id,
        objectType,
      },
      browseComments,
    } = this.props;

    const namespace = objectType.split('.')[1];
    const { LIMIT } = APP.BROWSE;

    browseComments({
      node: { id, objectType },
      start: this.offset,
      limit: LIMIT,
    }, namespace).then(() => {
      this.offset += LIMIT;
    });
  }

  handleAdd() {
    const { parent: { objectType }, addComment, viewer } = this.props;
    const { comment } = this.state;

    if (this.validate()) {
      const namespace = objectType.split('.')[1];
      addComment(comment, namespace).then(() => {
        this.setState({
          comment: {
            ...CommentDefault,
            author: viewer,
          },
        });
      });
    }
  }

  handleFieldChange(event) {
    const { comment } = this.state;
    const { parent } = this.props;
    const { target } = event;
    const { name, value } = target;

    this.validateField(name, value);
    comment[name] = value;
    comment.parentId = parent.id;

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
      comments,
      bodyError,
      bodyHelperText,
      hasMore,
    } = this.state;

    const {
      canAdd,
      parent,
      // isFetching,
    } = this.props;

    return (
      <React.Fragment>
        <InfiniteScroll
          loadMore={this.fetchComments}
          hasMore={hasMore}
          useWindow
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
            handleFieldChange={this.handleFieldChange}
            handleSave={this.handleAdd}
            bodyError={bodyError}
            bodyHelperText={bodyHelperText}
          />
        }
      </React.Fragment>
    );
  }
}

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
  parent: NodeType.isRequired,
  canAdd: PropTypes.bool,
  addComment: PropTypes.func.isRequired,
  browseComments: PropTypes.func.isRequired,
  resetComments: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
