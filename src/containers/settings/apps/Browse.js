import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Draggable } from 'react-smooth-dnd';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import AppsIcon from '@material-ui/icons/Apps';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import Progress from '../../../components/Progress';
import SelectSort from '../../../components/settings/apps/SelectSort';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import AppsEdit from './Edit';


import * as actions from '../../../actions';
import AppsType from '../../../proptypes/settings/Apps';
import utils from '../../utils';

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsAppsBrowse = (props) => {
  const {
    browseApps,
    editApp,
    resetApps,
    apps,
    error,
    success,
    isFetching,
    queryFilters: {
      sort: initSort,
    },
  } = props;

  const [sort, setSort] = useState(initSort);
  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetchList = (newSort) => {
    browseApps({
      sort: newSort,
      offset: 0,
      limit: LIMIT,
    });
    setSort(newSort);
  };

  useEffect(() => {
    fetchList(sort);

    return () => {
      resetApps();
    };
  }, []);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  const handleReorder = (result) => {
    const {
      addedIndex,
      payload: app,
    } = result;

    apps.allIds = utils.applyDrag(apps.allIds, result);

    editApp({
      ...app,
      enabled: true,
      ordering: addedIndex + 1,
    });
  };

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (apps.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      {current &&
        <AppsEdit
          node={current}
          open={editingOpen}
          handleClose={handleClose}
        />
      }
      <Card>
        <CardHeader
          title={
            <Typography variant="h4">Apps</Typography>
          }
          avatar={
            <Avatar>
              <AppsIcon />
            </Avatar>
          }
        />
        <CardContent>
          <SelectSort
            value={sort}
            handleOnChange={(event) => {
              const { target: { value } } = event;
              resetApps();
              fetchList(value);
            }}
            label="Sort by"
          />
        </CardContent>
        <List>
          <Container
            dragHandleSelector=".drag-handle"
            lockAxis="y"
            onDrop={handleReorder}
            getChildPayload={(index) => {
              const appId = apps.allIds[index];
              const app = apps.byId[appId];
              return app;
            }}
          >
            {apps.allIds.map((appId) => {
              const app = apps.byId[appId];
              const key = `app_${app.id}`;
              return (
                <Draggable key={key}>
                  <ListItem
                    divider
                    button
                    onClick={() => {
                      setCurrent(app);
                      setEditingOpen(true);
                    }}
                  >
                    <ListItemText
                      primary={app.name}
                      secondary={app.package}
                    />
                    <ListItemSecondaryAction>
                      {sort === SORT.ORDERING &&
                        <ListItemIcon
                          className="drag-handle"
                          style={{
                            cursor: 'move',
                          }}
                        >
                          <DragHandleIcon />
                        </ListItemIcon>
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                </Draggable>
              );
            })}
          </Container>
        </List>
      </Card>
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Saved successfully!"
          type="success"
        />
      }
    </React.Fragment>
  );
};


SettingsAppsBrowse.propTypes = {
  browseApps: PropTypes.func.isRequired,
  editApp: PropTypes.func.isRequired,
  resetApps: PropTypes.func.isRequired,
  apps: AppsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  queryFilters: PropTypes.object,
};

SettingsAppsBrowse.defaultProps = {
  queryFilters: {
    sort: SORT.ORDERING,
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseApps: (params) => {
      return dispatch(actions.settings.apps.browse(params));
    },
    editApp: (app) => {
      return dispatch(actions.settings.apps.edit(app));
    },
    resetApps: () => {
      return dispatch(actions.settings.apps.reset());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_apps: apps,
    error,
    success,
    isFetching,
  } = state.settingsApps;

  return {
    apps,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAppsBrowse);
