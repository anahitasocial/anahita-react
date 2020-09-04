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

import AppsEdit from './Edit';
import Progress from '../../../components/Progress';
import SelectSort from '../../../components/settings/apps/SelectSort';
import SimpleSnackbar from '../../../components/SimpleSnackbar';

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
    browseList,
    resetList,
    editItem,
    items,
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
    browseList({
      sort: newSort,
      offset: 0,
      limit: LIMIT,
    });
    setSort(newSort);
  };

  useEffect(() => {
    fetchList(sort);

    return () => {
      resetList();
    };
  }, [resetList]);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  const handleReorder = (result) => {
    const {
      addedIndex,
      payload: app,
    } = result;

    items.allIds = utils.applyDrag(items.allIds, result);

    editItem({
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

  if (items.allIds.length === 0 && isFetching) {
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
              resetList();
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
              const itemId = items.allIds[index];
              const app = items.byId[itemId];
              return app;
            }}
          >
            {items.allIds.map((itemId) => {
              const node = items.byId[itemId];
              const key = `app_${node.id}`;
              return (
                <Draggable key={key}>
                  <ListItem
                    divider
                    button
                    onClick={() => {
                      setCurrent(node);
                      setEditingOpen(true);
                    }}
                    disabled={!node.meta}
                  >
                    <ListItemText
                      primary={node.name}
                      secondary={node.package}
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
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  items: AppsType.isRequired,
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
    browseList: (params) => {
      return dispatch(actions.settings.apps.browse(params));
    },
    resetList: () => {
      return dispatch(actions.settings.apps.reset());
    },
    editItem: (app) => {
      return dispatch(actions.settings.apps.edit(app));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_apps: items,
    error,
    success,
    isFetching,
  } = state.settingsApps;

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
)(SettingsAppsBrowse);
