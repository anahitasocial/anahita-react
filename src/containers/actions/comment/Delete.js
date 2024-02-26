import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions';
import CommentType from '../../../proptypes/Comment';
import i18n from '../../../languages';
import DialogConfirm from '../../../components/DialogConfirm';

const ActionsCommentDelete = React.forwardRef((props, ref) => {
  const {
    deleteItem,
    deleteItemInline,
    comment,
    inline,
  } = props;

  const label = i18n.t('actions:delete');
  const deleteFunc = inline ? deleteItemInline : deleteItem;

  const handleDelete = () => {
    deleteFunc(comment);
  };

  return (
    <DialogConfirm
      message={i18n.t('comments:confirm.delete')}
    >
      <MenuItem
        onClick={handleDelete}
        aria-label={label}
        ref={ref}
      >
        {label}
      </MenuItem>
    </DialogConfirm>
  );
});

ActionsCommentDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  deleteItemInline: PropTypes.func.isRequired,
  comment: CommentType.isRequired,
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
    deleteItem: (comment) => {
      return dispatch(actions.comments.deleteItem(comment));
    },
    deleteItemInline: (comment) => {
      return dispatch(actions.commentsInline.deleteItem(comment));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsCommentDelete);
