import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions';
import NodeType from '../../proptypes/Node';
import i18n from '../../languages';
import utils from '../../utils';
import DialogConfirm from '../../components/DialogConfirm';

const ActionsDelete = React.forwardRef((props, ref) => {
  const {
    deleteItem,
    node,
    history,
    redirect,
    component,
    alertSuccess,
    alertError,
    confirmTitle,
    confirmMessage,
  } = props;

  const [waiting, setWaiting] = useState(false);

  const handleDelete = () => {
    setWaiting(true);
    deleteItem(node)
      .then(() => {
        alertSuccess(i18n.t('prompts:deleted.success'));

        if (redirect !== '') {
          history.push(redirect);
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

ActionsDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  redirect: PropTypes.string,
  component: PropTypes.oneOf(['button', 'menuitem']),
  confirmTitle: PropTypes.string,
  confirmMessage: PropTypes.string,
};

ActionsDelete.defaultProps = {
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsDelete));
