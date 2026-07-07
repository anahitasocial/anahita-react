import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions';
import NodeType from '../../proptypes/Node';
import i18n from '../../languages';
import utils from '../../utils';
import DialogConfirm from '../../components/dialog/Confirm';

const ControlsDelete = React.forwardRef(({
  deleteItem,
  node,
  redirect,
  component,
  alertSuccess,
  alertError,
  confirmTitle,
  confirmMessage,
}, ref) => {
  const [waiting, setWaiting] = useState(false);

  const navigate = useNavigate();

  const handleDelete = () => {
    setWaiting(true);
    deleteItem(node)
      .then(() => {
        alertSuccess(i18n.t('prompts:deleted.success'));

        if (redirect !== '') {
          navigate(redirect);
        }
      }).catch((err) => {
        console.error(err);
        alertError(i18n.t('prompts:deleted.error'));
      });
  };

  const label = i18n.t('actions:delete');

  if (component === 'menuitem') {
    return (
      <DialogConfirm
        title={confirmTitle}
        message={confirmMessage}
      >
        <MenuItem
          onClick={handleDelete}
          disabled={waiting}
          aria-label={label}
          ref={ref}
        >
          {label}
        </MenuItem>
      </DialogConfirm>
    );
  }

  return (
    <DialogConfirm
      title={confirmTitle}
      message={confirmMessage}
    >
      <Button
        onClick={handleDelete}
        disabled={waiting}
        aria-label={label}
        ref={ref}
      >
        {label}
      </Button>
    </DialogConfirm>
  );
});

ControlsDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  redirect: PropTypes.string,
  component: PropTypes.oneOf(['button', 'menuitem']),
  confirmTitle: PropTypes.string,
  confirmMessage: PropTypes.string,
};

ControlsDelete.defaultProps = {
  redirect: '',
  component: 'button',
  confirmTitle: i18n.t('prompts:confirm.title'),
  confirmMessage: i18n.t('prompts:confirm.message'),
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (node) => {
      const namespace = utils.node.getNamespace(node);
      return dispatch(actions[namespace].deleteItem(node));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlsDelete);
