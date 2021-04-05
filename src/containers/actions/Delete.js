import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import i18n from '../../languages';

const ActionsDelete = React.forwardRef((props, ref) => {
  const {
    deleteItem,
    node,
    history,
    redirect,
    alertSuccess,
    alertError,
  } = props;

  const [waiting, setWaiting] = useState(false);

  const handleDelete = (event) => {
    event.preventDefault();

    setWaiting(true);
    deleteItem(node)
      .then(() => {
        alertSuccess('Deleted successfully.');
        if (redirect !== '') {
          history.push(redirect);
        }
      }).catch((err) => {
        console.error(err);
        alertError('Something went wrong!');
      });
  };

  const label = i18n.t('actions:delete');

  return (
    <MenuItem
      onClick={handleDelete}
      disabled={waiting}
      aria-label={label}
      ref={ref}
    >
      {label}
    </MenuItem>
  );
});

ActionsDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  redirect: PropTypes.string,
};

ActionsDelete.defaultProps = {
  redirect: '',
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (node) => {
      const namespace = node.objectType.split('.')[1];
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
