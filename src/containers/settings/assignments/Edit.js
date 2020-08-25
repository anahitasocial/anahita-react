import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';

import AssignmentForm from '../../../components/settings/assignments/Form';

import * as actions from '../../../actions';

const SettingsAssignmentsEdit = (props) => {
  const {
    editAssignment,
    identifier,
    app,
    open,
    handleClose,
    isFetching,
  } = props;

  const [access, setAccess] = useState(app.access);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    app[name] = value;
    setAccess(value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    editAssignment({
      app: app.id,
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
        app={app}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        handleClose={handleClose}
        isFetching={isFetching}
      />
    </Dialog>
  );
};

SettingsAssignmentsEdit.propTypes = {
  editAssignment: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  app: PropTypes.objectOf(PropTypes.any).isRequired,
  open: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
};

SettingsAssignmentsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    editAssignment: (assignment) => {
      return dispatch(actions.settings.assignments.edit(assignment));
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
