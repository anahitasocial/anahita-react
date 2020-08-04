import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import AssignmentsIcon from '@material-ui/icons/SettingsApplications';

import * as actions from '../../../actions';
import i18n from '../../../languages';
import AssignmentsType from '../../../proptypes/settings/Assignments';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import Progress from '../../../components/Progress';
import AssignmentEdit from './Edit';

const CURRENT_DEFAULT = {
  identifier: '',
  app: null,
};

const SettingsAssignmentsBrowse = (props) => {
  const {
    browseAssignments,
    resetAssignments,
    assignments,
    error,
    success,
    isFetching,
  } = props;

  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState({ ...CURRENT_DEFAULT });

  useEffect(() => {
    browseAssignments({
      limit: 99,
      offset: 0,
    });

    return () => {
      resetAssignments();
    };
  }, []);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent({ ...CURRENT_DEFAULT });
  };

  if (assignments.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      {current.app &&
        <AssignmentEdit
          identifier={current.identifier}
          app={current.app}
          open={editingOpen}
          handleClose={handleClose}
          isFetching={isFetching}
        />
      }
      <Card>
        <CardHeader
          title={
            <Typography variant="h4">Assignments</Typography>
          }
          subheader="Manage assignments of apps to actors"
          avatar={
            <Avatar>
              <AssignmentsIcon />
            </Avatar>
          }
        />
        {assignments.allIds.map((identifier) => {
          const { apps } = assignments.byId[identifier];
          const type = identifier.split(':')[1].split('.')[0];
          const key = `assignment_${type}`;

          return (
            <React.Fragment key={key}>
              <CardContent>
                <Typography variant="h5">
                  {i18n.t(`${type}:mTitle`)}
                </Typography>
              </CardContent>
              <List>
                {apps.map((app) => {
                  const appKey = `assignment-app-${type}-${app.id}`;
                  return (
                    <ListItem
                      divider
                      button
                      onClick={() => {
                        setCurrent({ ...current, identifier, app });
                        setEditingOpen(true);
                      }}
                      key={appKey}
                    >
                      <ListItemText
                        primary={app.name}
                        secondary={i18n.t(`settings:assignment.options.${app.selected}`)}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          );
        })}
      </Card>
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

SettingsAssignmentsBrowse.propTypes = {
  browseAssignments: PropTypes.func.isRequired,
  resetAssignments: PropTypes.func.isRequired,
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
)(SettingsAssignmentsBrowse);
