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
import utils from '../../../utils';

const { applyDrag } = utils.component;

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsPlugins = (props) => {
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
  const [type, setType] = useState('');
  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetchList = (
    newType = '',
    newSort = SORT.ORDERING,
  ) => {
    browseList({
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
      payload: plugin,
    } = result;

    items.allIds = applyDrag(items.allIds, result);

    editItem({
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

  if (items.allIds.length === 0 && isFetching) {
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
      <Card variant="outlined">
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
              resetList();
              fetchList(type, value);
            }}
            label="Sort by"
          />
          <SelectType
            value={type}
            handleOnChange={(event) => {
              const { target: { value } } = event;
              resetList();
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
              const nodeId = items.allIds[index];
              const node = items.byId[nodeId];
              return node;
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
                      secondary={`${node.element} (${node.type})`}
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
  browseList: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  items: PluginsType.isRequired,
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
    browseList: (params) => {
      return dispatch(actions.settings.plugins.browse(params));
    },
    resetList: () => {
      return dispatch(actions.settings.plugins.reset());
    },
    editItem: (node) => {
      return dispatch(actions.settings.plugins.edit(node));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_plugins: items,
    error,
    success,
    isFetching,
  } = state.settingsPlugins;

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
)(SettingsPlugins);
