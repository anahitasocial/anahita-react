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
    browseList,
    resetList,
    items,
    error,
    success,
    isFetching,
  } = props;

  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState({ ...CURRENT_DEFAULT });

  useEffect(() => {
    browseList({
      limit: 99,
      offset: 0,
    });

    return () => {
      resetList();
    };
  }, [browseList, resetList]);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent({ ...CURRENT_DEFAULT });
  };

  if (items.allIds.length === 0 && isFetching) {
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
            <Typography variant="h4">App Assignments</Typography>
          }
          subheader="Manage items of apps to actors"
          avatar={
            <Avatar>
              <AssignmentsIcon />
            </Avatar>
          }
        />
        {items.allIds.map((identifier) => {
          const { apps } = items.byId[identifier];
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
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  items: AssignmentsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.settings.assignments.browse(params));
    },
    resetList: () => {
      return dispatch(actions.settings.assignments.reset());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_assignments: items,
    error,
    success,
    isFetching,
  } = state.settingsAssignments;

  return {
    items,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAssignmentsBrowse);
