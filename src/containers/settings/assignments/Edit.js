import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';

import AssignmentForm from '../../../components/settings/assignments/Form';

import actions from '../../../actions';

const SettingsAssignmentsEdit = (props) => {
  const {
    editItem,
    identifier,
    node,
    open,
    handleClose,
    isFetching,
  } = props;

  const [access, setAccess] = useState(node.access);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    node[name] = value;
    setAccess(value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    editItem({
      app: node.id,
      access,
      actor: identifier,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <AssignmentForm
        identifier={identifier}
        app={node}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        handleClose={handleClose}
        isFetching={isFetching}
      />
    </Dialog>
  );
};

SettingsAssignmentsEdit.propTypes = {
  editItem: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  node: PropTypes.objectOf(PropTypes.any).isRequired,
  open: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
};

SettingsAssignmentsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    editItem: (node) => {
      return dispatch(actions.settings.assignments.edit(node));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAssignmentsEdit);
