import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentRead from './Read';
import CommentForm from '../../../components/comment/Form';

import actions from '../../../actions/inline_comments';
import i18n from '../../../languages';

import CommentsType from '../../../proptypes/Comments';
import CommentDefault from '../../../proptypes/CommentDefault';
import NodeType from '../../../proptypes/Node';
import NodesType from '../../../proptypes/Nodes';
import PersonType from '../../../proptypes/Person';
import { Comments as COMMENT } from '../../../constants';

class CommentsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      comment: {
        ...CommentDefault,
        author: props.viewer,
      },
      comments: props.comments,
      bodyError: false,
      bodyHelperText: '',
    };

    this.offset = 0;
    this.handleAdd = this.handleAdd.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);

    const {
      parent,
      comments,
      setComments,
    } = props;

    const namespace = parent.objectType.split('.')[1];

    setComments(comments, parent, namespace);
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
          const key = `comment-${item.id}`;
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
  // isFetching: PropTypes.bool.isRequired,
};

CommentsBrowse.defaultProps = {
  canAdd: false,
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsBrowse));
