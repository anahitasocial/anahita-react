import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Progress from '../../../../components/Progress';
import AppRead from './Read';

import AppsType from '../../../../proptypes/actor/Apps';
import ActorType from '../../../../proptypes/Actor';
import actions from '../../../../actions';
import i18n from '../../../../languages';

const ActorsSettingsAppsBrowse = (props) => {
  const {
    browseList,
    editItem,
    resetList,
    alertError,
    alertSuccess,
    actor,
    items,
    isFetching,
    success,
    error,
  } = props;

  useEffect(() => {
    browseList(actor);

    return () => {
      resetList();
    };
  }, [actor.id]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  const handleEditApp = (app) => {
    editItem({ actor, app });
  };

  if (items.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <List>
      {items.allIds.map((itemId) => {
        const node = items.byId[itemId];
        const key = `app_node_${node.id}`;
        return (
          <AppRead
            key={key}
            app={node}
            handleEdit={handleEditApp}
            isFetching={isFetching}
          />
        );
      })}
    </List>
  );
};

ActorsSettingsAppsBrowse.propTypes = {
  actor: ActorType.isRequired,
  browseList: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: AppsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    const {
      [`${namespace}_apps`]: items,
      isFetching,
      error,
      success,
    } = state[`${namespace}Apps`];

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
        return dispatch(actions[namespace].settings.apps.browse(params));
      },
      editItem: (node) => {
        return dispatch(actions[namespace].settings.apps.edit(node));
      },
      resetList: () => {
        return dispatch(actions[namespace].settings.apps.reset());
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

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsAppsBrowse);
};
