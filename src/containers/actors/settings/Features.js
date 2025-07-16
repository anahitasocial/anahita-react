import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import ActorType from '../../../proptypes/Actor';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';

const ActorsSettingsAppsBrowse = (props) => {
  const {
    alertError,
    alertSuccess,
    actor,
    namespace,
    readItem,
  } = props;

  const [features, setFeatures] = useState(actor.features);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    const updatedFeatures = features.map((feature) => {
      if (feature.service === name) {
        return { ...feature, enabled: checked };
      }
      return feature;
    });
    setFeatures([...updatedFeatures]);
  };

  const handleEdit = () => {
    api[namespace][singularize(namespace)].features.edit(actor.id, features).then(() => {
      alertSuccess(i18n.t('prompts:updated.success'));
    }).catch((err) => {
      alertError(i18n.t('prompts:updated.error'));
      console.error('Error updating feature:', err);
    });
  };

  return (
    <>
      <List>
        {features.map((feature) => {
          const featureName = feature.service.split('-')[0];
          const key = `feature_${featureName}`;
          return (
            <ListItem key={key} divider>
              <ListItemText
                primary={i18n.t(`features:${featureName}.title`)}
                secondary={i18n.t(`features:${featureName}.description`)}
              />
              <ListItemSecondaryAction>
                <Switch
                  name={feature.service}
                  checked={feature.enabled}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  disabled={!feature.optional}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <CardActions>
        <Button
          type="button"
          className="btn btn-primary"
          onClick={handleEdit}
          fullWidth
          variant="contained"
          color="primary"
        >
          {i18n.t('actions:update')}
        </Button>
      </CardActions>
    </>
  );
};

ActorsSettingsAppsBrowse.propTypes = {
  actor: ActorType.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  readItem: PropTypes.func.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    return {
      actor,
      namespace,
    };
  };
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
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
