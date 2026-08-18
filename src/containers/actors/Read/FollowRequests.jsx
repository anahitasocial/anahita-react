import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FollowRequestsIcon from '@material-ui/icons/People';

import ActorAvatar from '../../../components/ActorAvatar';

import actions from '../../../actions';
import ActorsType from '../../../proptypes/Actors';
import ActorType from '../../../proptypes/Actor';
import i18n from '../../../languages';

const ActorsFollowRequests = React.forwardRef(({
  browseList,
  resetList,
  addItem,
  deleteItem,
  alertError,
  alertSuccess,
  namespace,
  items,
  actor,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    browseList(actor);

    return () => {
      resetList();
    };
  }, [browseList, actor, resetList]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {i18n.t(`${namespace}:settings.followRequests`)}
        </DialogTitle>
        <List>
          {items.allIds.map((itemId) => {
            const node = items.byId[itemId];
            const key = `${namespace}_followrequest_node_${itemId}`;
            return (
              <ListItem key={key}>
                <ListItemAvatar>
                  <ActorAvatar actor={node} linked />
                </ListItemAvatar>
                <ListItemText
                  primary={node.name}
                />
                <ListItemSecondaryAction>
                  <Button
                    onClick={() => {
                      deleteItem({ actor, followRequest: node })
                        .then(() => {
                          alertSuccess(i18n.t('prompts:deleted.success'));
                          return handleClose();
                        }).catch(() => {
                          alertError(i18n.t('prompts:deleted.error'));
                        });
                    }}
                  >
                    {i18n.t('commons:ignore')}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      addItem({ actor, followRequest: node })
                        .then(() => {
                          alertSuccess(i18n.t('prompts:added.success'));
                          return handleClose();
                        }).catch(() => {
                          alertError(i18n.t('prompts:added.error'));
                        });
                    }}
                  >
                    {i18n.t('commons:accept')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        <DialogActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            {i18n.t('commons:close')}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        ref={ref}
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={items.allIds.length === 0}
      >
        <Badge
          color="secondary"
          badgeContent={items.allIds.length}
          overlap="rectangular"
        >
          <FollowRequestsIcon />
        </Badge>
      </IconButton>
    </>
  );
});

ActorsFollowRequests.propTypes = {
  actor: ActorType.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    const {
      [`${namespace}_followrequests`]: items,
      isFetching,
      error,
      success,
    } = state[`${namespace}FollowRequests`];

    return {
      actor,
      items,
      namespace,
      error,
      success,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseList: (params) => {
        return dispatch(actions[namespace].followRequests.browse(params));
      },
      resetList: () => {
        return dispatch(actions[namespace].followRequests.reset());
      },
      addItem: (params) => {
        return dispatch(actions[namespace].followRequests.add(params));
      },
      deleteItem: (params) => {
        return dispatch(actions[namespace].followRequests.deleteItem(params));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

// Invoked from inside a render body — see the note in actors/Browse/index.jsx.
const connectedByNamespace = {};

export default (namespace) => {
  if (!connectedByNamespace[namespace]) {
    connectedByNamespace[namespace] = connect(
      mapStateToProps(namespace),
      mapDispatchToProps(namespace),
    )(ActorsFollowRequests);
  }

  return connectedByNamespace[namespace];
};
