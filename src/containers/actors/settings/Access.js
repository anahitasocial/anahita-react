import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import DialogAlert from '../../../components/DialogAlert';

import ActorType from '../../../proptypes/Actor';
import actions from '../../../actions';
import i18n from '../../../languages';
import utils from '../../../utils';
import { Access as ACCESS } from '../../../constants';

const ActorsSettingsAccess = (props) => {
  const {
    editAccess,
    alertError,
    alertSuccess,
    actor,
    namespace,
  } = props;

  const actorType = utils.node.isPerson(actor) ? 'PEOPLE' : 'ACTORS';
  const accessOptions = _.values(ACCESS[actorType]);

  const [showDialog, setShowDialog] = useState(false);
  const [access, setAccess] = useState(actor.access);
  const [allowFollowRequest, setAllowFollowRequest] = useState(actor.allowFollowRequest);
  const [waiting, setWaiting] = useState(false);

  const handleOnChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === 'access') {
      setAccess(value);
      setShowDialog(true);
    } else if (name === 'allowFollowRequest') {
      setAllowFollowRequest(checked);
    }

    // else if (name.startsWith('leadable:')) {
    //   const key = name.split(':')[1];
    //   actor.privacy[key] = value;
    // }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    setWaiting(true);
    editAccess({
      ...actor,
      access,
      allowFollowRequest,
    }).then(() => {
      alertSuccess(i18n.t('actor:access.alerts.success'));
      setWaiting(false);
    }).catch((error) => {
      alertError(i18n.t('actor:access.alerts.error', { error }));
      setWaiting(false);
    });
  };

  const handleDismiss = () => {
    setShowDialog(false);
  };

  return (
    <>
      <DialogAlert
        title={i18n.t('actor:access.title')}
        content={i18n.t('actor:access.content')}
        handleConfirm={handleOnSubmit}
        handleDismiss={handleDismiss}
        open={showDialog}
      />
      <form onSubmit={handleOnSubmit}>
        <Card variant="outlined">
          <CardContent>
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                id={`${namespace}-access-label-id`}
              >
                {i18n.t('actor:access.labels.whoCanSee')}
              </InputLabel>
              <Select
                id={`${namespace}-access-id`}
                labelId={`${namespace}-access-label-id`}
                name="access"
                value={actor.access}
                onChange={handleOnChange}
                label={i18n.t('actor:access.labels.whoCanSee')}
              >
                {accessOptions.map((option) => {
                  const optionKey = `access-${option}`;
                  return (
                    <MenuItem
                      key={optionKey}
                      value={option}
                    >
                      {i18n.t(`access:${option}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={allowFollowRequest}
                  onChange={handleOnChange}
                  name="allowFollowRequest"
                  disabled={[
                    ACCESS.ACTORS.PUBLIC,
                    ACCESS.ACTORS.REGISTERED,
                  ].includes(actor.access)}
                />
              }
              label={i18n.t('actor:access.labels.othersCanRequestToFollow')}
            />
            {/* {actor.isAdministrated &&
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel
                  id={`${namespace}-privacy-leadable-add-label-id`}
                >
                  {i18n.t('actor:privacy.labels.whoCanAddNewFollowers')}
                </InputLabel>
                <Select
                  id={`${namespace}-privacy-leadable-add-id`}
                  labelId={`${namespace}-privacy-leadable-add-label-id`}
                  name="leadable:add"
                  value={privacy['leadable:add']}
                  onChange={handleOnChange}
                  label={i18n.t('actor:privacy.labels.whoCanAddNewFollowers')}
                >
                  {Object.keys(accessOptions).map((key) => {
                    const option = accessOptions[key];
                    return (
                      <MenuItem
                        key={`people-privacy-leadable-add-${option}`}
                        value={option}
                      >
                        {i18n.t(`access:${option}`)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>} */}
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={waiting}
              fullWidth
              onClick={handleOnSubmit}
            >
              {i18n.t('actions:update')}
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

ActorsSettingsAccess.propTypes = {
  actor: ActorType.isRequired,
  editAccess: PropTypes.func.isRequired,
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

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      editAccess: (params) => {
        return dispatch(actions[namespace].editAccess(params));
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
  )(ActorsSettingsAccess);
};
