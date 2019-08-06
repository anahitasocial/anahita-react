import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentRead from './Read';
import CommentForm from '../../components/comment/Form';

import actions from '../../actions/comments';
import NodeType from '../../proptypes/Node';
import CommentsType from '../../proptypes/Comments';
import NodesType from '../../proptypes/Nodes';
import CommentDefault from '../../proptypes/CommentDefault';
import i18n from '../../languages';

const MAX_CHAR_LIMIT = 5000;

class CommentsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      comment: { ...CommentDefault },
      comments: props.comments,
      bodyError: false,
      bodyHelperText: '',
    };

    this.offset = 0;
    this.handleAdd = this.handleAdd.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentWillMount() {
    const {
      parent,
      comments,
      setComments,
    } = this.props;

    setComments(parent, comments);
  }

  componentWillReceiveProps(nextProps) {
    const { parent: { id } } = this.props;
    const { parents } = nextProps;
    const comments = parents.byId[id];

    if (comments) {
      this.setState({ comments });
    }
  }


  handleAdd() {
    const { parent, addComment } = this.props;
    const { comment } = this.state;
    if (this.validate()) {
      addComment(comment, parent).then(() => {
        this.setState({
          comment: { ...CommentDefault },
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

    if (name === 'body') {
      if (value.length === 0 || value.length > MAX_CHAR_LIMIT) {
        fieldError.error = true;
        fieldError.helperText = i18n.t('comments:comment.bodyErrorHelperText', {
          max: MAX_CHAR_LIMIT,
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
    } = this.state;

    const {
      canAdd,
      parent,
      // isFetching,
    } = this.props;

    return (
      <React.Fragment>
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
    parents,
    error,
    isFetching,
  } = state.comments;

  return {
    viewer,
    parents,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setComments: (parent, comments) => {
      return dispatch(actions.setList(parent, comments));
    },
    addComment: (comment, node) => {
      return dispatch(actions.add(comment, node));
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
  // isFetching: PropTypes.bool.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
