import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import AssignmentsType from '../../proptypes/settings/Assignments';
import SettingsAssignmentsForm from '../../components/settings/assignments/Form';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import Progress from '../../components/Progress';

const SettingsAssignments = (props) => {
  const {
    browseAssignments,
    resetAssignments,
    editAssignment,
    assignments,
    error,
    success,
    isFetching,
  } = props;

  useEffect(() => {
    browseAssignments({
      limit: 99,
      offset: 0,
    });

    return () => {
      resetAssignments();
    };
  }, []);

  const handleOnChange = (event) => {
    const { target } = event;
    console.log(target.value);
  };

  if (assignments.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      <SettingsAssignmentsForm
        assignments={assignments}
        handleOnChange={handleOnChange}
        isFetching={isFetching}
      />
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Assignment Updated!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

SettingsAssignments.propTypes = {
  browseAssignments: PropTypes.func.isRequired,
  resetAssignments: PropTypes.func.isRequired,
  editAssignment: PropTypes.func.isRequired,
  assignments: AssignmentsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseAssignments: (params) => {
      return dispatch(actions.settings.assignments.browse(params));
    },
    editAssignment: (assignment) => {
      return dispatch(actions.settings.assignments.edit(assignment));
    },
    resetAssignments: () => {
      return dispatch(actions.settings.assignments.reset());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_assignments: assignments,
    error,
    success,
    isFetching,
  } = state.settingsAssignments;

  return {
    assignments,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAssignments);
