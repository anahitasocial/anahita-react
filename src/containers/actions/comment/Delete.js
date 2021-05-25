import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions';
import CommentType from '../../../proptypes/Comment';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const ActionsCommentDelete = React.forwardRef((props, ref) => {
  const {
    deleteItem,
    deleteItemInline,
    comment,
    node: {
      objectType,
    },
    inline,
  } = props;

  const label = i18n.t('actions:delete');
  const namespace = objectType.split('.')[1];
  const deleteFunc = inline ? deleteItemInline : deleteItem;

  const handleDelete = (event) => {
    event.preventDefault();
    deleteFunc(comment, namespace);
  };

  return (
    <MenuItem
      onClick={handleDelete}
      aria-label={label}
      ref={ref}
    >
      {label}
    </MenuItem>
  );
});

ActionsCommentDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  deleteItemInline: PropTypes.func.isRequired,
  comment: CommentType.isRequired,
  node: NodeType.isRequired,
  inline: PropTypes.bool,
};

ActionsCommentDelete.defaultProps = {
  inline: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (comment, namespace) => {
      return dispatch(actions.comments(namespace).deleteItem(comment));
    },
    deleteItemInline: (comment, namespace) => {
      return dispatch(actions.commentsInline(namespace).deleteItem(comment));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsCommentDelete);
