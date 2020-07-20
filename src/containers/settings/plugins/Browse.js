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

import DragHandleIcon from '@material-ui/icons/DragHandle';
import PluginsIcon from '@material-ui/icons/Extension';

import Progress from '../../../components/Progress';
import SelectType from '../../../components/settings/plugins/SelectType';
import SelectSort from '../../../components/settings/plugins/SelectSort';

import * as actions from '../../../actions';
import PluginsType from '../../../proptypes/settings/Plugins';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import PluginsEdit from './Edit';

import utils from '../../utils';

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsPlugins = (props) => {
  const {
    browsePlugins,
    editPlugin,
    resetPlugins,
    plugins,
    error,
    success,
    isFetching,
    queryFilters: {
      sort: initSort,
    },
  } = props;

  const [sort, setSort] = useState(initSort);
  const [type, setType] = useState('');
  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetchList = (
    newType = '',
    newSort = SORT.ORDERING,
  ) => {
    browsePlugins({
      sort: newSort,
      type: newType,
      offset: 0,
      limit: LIMIT,
    });
    setType(newType);
    setSort(newSort);
  };

  useEffect(() => {
    fetchList(type, sort);

    return () => {
      resetPlugins();
    };
  }, []);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  const handleReorder = (result) => {
    const {
      addedIndex,
      payload: plugin,
    } = result;

    plugins.allIds = utils.applyDrag(plugins.allIds, result);

    editPlugin({
      ...plugin,
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

  if (plugins.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      {current &&
        <PluginsEdit
          node={current}
          open={editingOpen}
          handleClose={handleClose}
        />
      }
      <Card>
        <CardHeader
          title={
            <Typography variant="h4">Plugins</Typography>
          }
          avatar={
            <Avatar>
              <PluginsIcon />
            </Avatar>
          }
        />
        <CardContent>
          <SelectSort
            value={sort}
            handleOnChange={(event) => {
              const { target: { value } } = event;
              resetPlugins();
              fetchList(type, value);
            }}
            label="Sort by"
          />
          <SelectType
            value={type}
            handleOnChange={(event) => {
              const { target: { value } } = event;
              resetPlugins();
              fetchList(value, sort);
            }}
            label="Filter by type"
          />
        </CardContent>
        <List>
          <Container
            dragHandleSelector=".drag-handle"
            lockAxis="y"
            onDrop={handleReorder}
            getChildPayload={(index) => {
              const appId = plugins.allIds[index];
              const app = plugins.byId[appId];
              return app;
            }}
          >
            {plugins.allIds.map((pluginId) => {
              const plugin = plugins.byId[pluginId];
              const key = `app_${plugin.id}`;
              return (
                <Draggable key={key}>
                  <ListItem
                    divider
                    button
                    onClick={() => {
                      setCurrent(plugin);
                      setEditingOpen(true);
                    }}
                  >
                    <ListItemText
                      primary={plugin.name}
                      secondary={`${plugin.element} (${plugin.type})`}
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


SettingsPlugins.propTypes = {
  browsePlugins: PropTypes.func.isRequired,
  editPlugin: PropTypes.func.isRequired,
  resetPlugins: PropTypes.func.isRequired,
  plugins: PluginsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  queryFilters: PropTypes.object,
};

SettingsPlugins.defaultProps = {
  queryFilters: {
    sort: SORT.ORDERING,
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    browsePlugins: (params) => {
      return dispatch(actions.settings.plugins.browse(params));
    },
    editPlugin: (plugin) => {
      return dispatch(actions.settings.plugins.edit(plugin));
    },
    resetPlugins: () => {
      return dispatch(actions.settings.plugins.reset());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_plugins: plugins,
    error,
    success,
    isFetching,
  } = state.settingsPlugins;

  return {
    plugins,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPlugins);
