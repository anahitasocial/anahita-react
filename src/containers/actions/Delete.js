import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from 'react-router-dom';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import i18n from '../../languages';

const ActionsDelete = React.forwardRef((props, ref) => {
  const {
    deleteItem,
    node,
    redirect,
  } = props;

  const [waiting, setWaiting] = useState(false);

  const handleDelete = (event) => {
    event.preventDefault();

    setWaiting(true);
    deleteItem(node).then(() => {
      setWaiting(false);
    });
  };

  if (redirect && !node.id && !waiting) {
    return (<Redirect push to={redirect} />);
  }

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
  node: NodeType.isRequired,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsDelete);
