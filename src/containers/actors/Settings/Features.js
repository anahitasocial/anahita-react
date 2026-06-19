import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';
import _ from 'lodash';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import ActorType from '../../../proptypes/Actor';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';
import utils from '../../../utils';

const ACCESS = {
  PERSON: {
    REGISTERED: 'registered',
    FOLLOWERS: 'followers',
    LEADERS: 'leaders',
    MUTUALS: 'mutuals',
    ADMINS: 'admins',
  },
  ACTOR: {
    REGISTERED: 'registered',
    FOLLOWERS: 'followers',
    ADMINS: 'admins',
  },
};

const PUBLIC_ENTITIES = ['like', 'comment'];

const useStyles = makeStyles((theme) => {
  return {
    formControl: {
      marginTop: theme.spacing(2),
    },
    inputLabel: {
      marginLeft: theme.spacing(2),
      marginTop: -theme.spacing(1),
    },
  };
});

const ActorsSettingsAppsBrowse = ({
  alertError,
  alertSuccess,
  actor,
  namespace,
}) => {
  const classes = useStyles();
  const actorType = utils.node.isPerson(actor) ? 'PERSON' : 'ACTOR';
  const accessOptions = _.values(ACCESS[actorType]);

  const [features, setFeatures] = useState(actor.features || []);
  const [expanded, setExpanded] = useState(false);

  const handleToggleEnabled = (serviceName, checked) => {
    setFeatures((prevFeatures) => {
      return prevFeatures.map((feature) => {
        if (feature.service === serviceName) {
          return {
            ...feature,
            enabled: checked,
          };
        }
        return feature;
      });
    });
  };

  const handlePermissionChange = (serviceName, entityName, newAccess) => {
    setFeatures((prevFeatures) => {
      return prevFeatures.map((feature) => {
        if (feature.service !== serviceName) {
          return feature;
        }

        const addPermissions = (feature.addPermissions || []).map((permission) => {
          if (permission.entity === entityName) {
            return {
              ...permission,
              access: newAccess,
            };
          }
          return permission;
        });

        return {
          ...feature,
          addPermissions,
        };
      });
    });
  };

  const handleEdit = () => {
    api[namespace][singularize(namespace)].features.edit(actor.id, features)
      .then(() => {
        alertSuccess(i18n.t('prompts:updated.success'));
      })
      .catch((err) => {
        alertError(i18n.t('prompts:updated.error'));
        console.error('Error updating feature:', err);
      });
  };

  const getAccessOptions = (entity) => {
    if (PUBLIC_ENTITIES.includes(entity)) {
      return accessOptions;
    }
    return accessOptions.filter((option) => {
      return option !== ACCESS[actorType].REGISTERED;
    });
  };

  return (
    <>
      {features.map((feature) => {
        const featureName = feature.service.split('-')[0];
        const key = `feature_${featureName}`;
        const addPermissions = feature.addPermissions || [];

        return (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={() => {
              setExpanded(expanded === key ? false : key);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${key}-content`}
              id={`${key}-header`}
            >
              <ListItemText
                primary={i18n.t(`features:${featureName}.title`)}
                secondary={i18n.t(`features:${featureName}.description`)}
              />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      name={feature.service}
                      checked={feature.enabled}
                      onChange={(e) => {
                        handleToggleEnabled(feature.service, e.target.checked);
                      }}
                      disabled={!feature.optional}
                    />
                  }
                  label={i18n.t('commons:enabled')}
                />
                {addPermissions.map((permission) => {
                  const permissionKey = `${key}_${permission.entity}`;
                  const filteredAccessOptions = getAccessOptions(permission.entity);

                  return (
                    <FormControl
                      key={permissionKey}
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        id={`${permissionKey}-label`}
                        htmlFor={permissionKey}
                        className={classes.inputLabel}
                      >
                        {i18n.t(`features:${featureName}.addPermissions.${permission.entity}`)}
                      </InputLabel>
                      <Select
                        id={permissionKey}
                        labelId={`${permissionKey}-label`}
                        variant="outlined"
                        value={permission.access}
                        onChange={(e) => {
                          handlePermissionChange(
                            feature.service,
                            permission.entity,
                            e.target.value,
                          );
                        }}
                        label={i18n.t(`features:${featureName}.addPermissions.${permission.entity}`)}
                      >
                        {filteredAccessOptions.map((option) => {
                          return (
                            <MenuItem
                              key={`${permissionKey}-${option}`}
                              value={option}
                            >
                              {i18n.t(`access:${option}`)}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  );
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <CardActions>
        <Button
          type="button"
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
