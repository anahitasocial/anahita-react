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

const ActorsSettingsAppsBrowse = (props) => {
  const classes = useStyles();
  const {
    alertError,
    alertSuccess,
    actor,
    namespace,
  } = props;

  const actorType = utils.node.isPerson(actor) ? 'PERSON' : 'ACTOR';
  const accessOptions = _.values(ACCESS[actorType]);

  const [features, setFeatures] = useState(actor.features);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    // console.debug('Feature change:', name, value, checked);

    const updatedFeatures = features.map((feature) => {
      if (feature.service === name) {
        return {
          ...feature,
          enabled: checked,
        };
      }

      if (feature.add_permissions) {
        const addPermissions = feature.add_permissions.map((permission) => {
          if (permission.entity === name.split('.add_permissions.')[1]) {
            return {
              ...permission,
              access: value,
            };
          }
          return permission;
        });

        return {
          ...feature,
          add_permissions: addPermissions,
        };
      }

      return feature; // Ensure a value is returned for every iteration
    });

    // console.debug('Updated features:', updatedFeatures);

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
      {features.map((feature) => {
        const featureName = feature.service.split('-')[0];
        const key = `feature_${featureName}`;
        const addPermissions = feature.add_permissions || [];
        return (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={() => {
              return setExpanded(expanded === key ? false : key);
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
                        handleChange(e);
                      }}
                      disabled={!feature.optional}
                    />
                  }
                  label="Enabled"
                />
                {addPermissions.map((permission) => {
                  const permissionKey = `feature_${featureName}_${permission.entity}`;

                  // if permission.entity is not like or comment
                  // then filter out the REGISTERED access
                  const filteredAccessOptions = permission.entity !== 'like' && permission.entity !== 'comment'
                    ? accessOptions.filter((option) => {
                      return option !== ACCESS[actorType].REGISTERED;
                    }) : accessOptions;

                  return (
                    <FormControl
                      key={permissionKey}
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id={`${permissionKey}-label`} htmlFor={permissionKey} className={classes.inputLabel}>
                        {i18n.t(`features:${featureName}.addPermissions.${permission.entity}`)}
                      </InputLabel>
                      <Select
                        id={permissionKey}
                        labelId={`${permissionKey}-label`}
                        variant="outlined"
                        value={permission.access}
                        onChange={(event) => {
                          handleChange({
                            target: {
                              name: `${feature.service}.add_permissions.${permission.entity}`,
                              value: event.target.value,
                            },
                          });
                        }}
                        label={i18n.t(`features:${featureName}.addPermissions.${permission.entity}`)}
                      >
                        {filteredAccessOptions.map((option) => {
                          const optionKey = `${key}-${option}`;
                          return (
                            <MenuItem
                              key={optionKey}
                              value={option}
                              fullWidth
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
