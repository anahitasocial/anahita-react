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

import i18n from '../../../languages';
import AppsEdit from './Edit';
import Progress from '../../../components/Progress';
import SelectSort from '../../../components/settings/apps/SelectSort';

import actions from '../../../actions';
import AppsType from '../../../proptypes/settings/Apps';
import utils from '../../../utils';

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const { applyDrag } = utils.component;

const SettingsAppsBrowse = (props) => {
  const {
    browseList,
    resetList,
    editItem,
    alertError,
    alertSuccess,
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

  useEffect(() => {
    browseList({
      sort,
      offset: 0,
      limit: LIMIT,
    });

    return () => {
      resetList();
    };
  }, [sort]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  const handleReorder = (result) => {
    const {
      addedIndex,
      payload: app,
    } = result;

    items.allIds = applyDrag(items.allIds, result);

    editItem({
      ...app,
      enabled: true,
      ordering: addedIndex + 1,
    });
  };

  if (items.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <>
      {current &&
        <AppsEdit
          node={current}
          open={editingOpen}
          handleClose={handleClose}
        />}
      <Card variant="outlined">
        <CardHeader
          title={
            <Typography variant="h4">
              {i18n.t('settings:apps.cTitle')}
            </Typography>
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
              setSort(value);
            }}
            label={i18n.t('commons:sortBy')}
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
                        </ListItemIcon>}
                    </ListItemSecondaryAction>
                  </ListItem>
                </Draggable>
              );
            })}
          </Container>
        </List>
      </Card>
    </>
  );
};

SettingsAppsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
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
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
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
